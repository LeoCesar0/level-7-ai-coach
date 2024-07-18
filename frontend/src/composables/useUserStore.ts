import type { IUserFull } from "@common/schemas/userFull";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { ISignIn } from "~/@schemas/auth";
import { handleUnexpectedError } from "~/handlers/handleUnexpectedError";
import { makeStoreKey } from "~/helpers/makeStoreKey";
import { sleep } from "~/helpers/sleep";
import { ROUTE } from "~/static/routes";

export const useUserStore = defineStore(makeStoreKey("users"), () => {
  const { firebaseAuth } = useFirebase();
  const currentUser = ref<IUserFull | null>(null);
  const loading = ref(false);
  const { handleToastAnyPromise } = useToast();
  const { fetchApi } = useFetchApi();
  const { toast } = useToast();
  const route = useRoute();

  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);

  watch(currentUser, async (newVal) => {
    console.log("❗ currentUser -->", newVal);
  });

  // const isServerSide = getIsServerSide();
  const isServerSide = typeof window === "undefined";

  const logout = async () => {
    loading.value = true;
    try {
      await firebaseAuth.signOut();
      authToken.value = "";
    } catch (error) {}
    navigateTo(ROUTE["sign-in"].href);
    loading.value = false;
  };

  const fetchCurrentUser = async () => {
    const { response } = await fetchApi<IUserFull>(
      {
        url: "/users/me",
        method: "GET",
      },
      {
        loadingRefs: [loading],
      }
    );

    return { response };
  };

  const handleFetchCurrentUser = async () => {
    const { response } = await fetchCurrentUser();

    if (response.data) {
      currentUser.value = response.data;
    }

    if (!response.data) {
      console.error("❗ auth error -->", response.error);
      // toast.error("You need to sign in again");
      currentUser.value = null;
    }
  };

  if (!isServerSide) {
    firebaseAuth.onAuthStateChanged(async (user) => {
      console.log("❗ onAuthStateChanged -->", user);
      if (user) {
        const token = await user.getIdToken();
        authToken.value = token;
      } else {
        authToken.value = "";
        currentUser.value = null;
      }
    });
  }

  const login = async (values: ISignIn) => {
    const { email, password } = values;
    loading.value = true;
    try {
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      navigateTo(ROUTE.dashboard.href);
    } catch (err) {
      console.log("❗ err -->", err);
      const error = handleUnexpectedError({ error: err });
      toast.error(error.error.message);
    }

    loading.value = false;
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    fetchCurrentUser,
    handleFetchCurrentUser,
  };
});