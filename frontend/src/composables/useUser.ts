import type { IUserFull } from "@common/schemas/userFull";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { ISignIn } from "~/@schemas/auth";
import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useUser = defineStore(makeStoreKey("users"), () => {
  const { firebaseAuth } = useFirebase();
  const currentUser = ref<IUserFull | null>(null);
  const loading = ref(false);
  const { handleToastAnyPromise } = useToast();
  const tokenCookie = useAuthToken();
  const { fetchApi } = useFetchApi();
  const { toast } = useToast();

  // const isServerSide = getIsServerSide();
  const isServerSide = typeof window === "undefined";

  const login = async (values: ISignIn) => {
    const { email, password } = values;
    const response = await handleToastAnyPromise({
      promise: signInWithEmailAndPassword(firebaseAuth, email, password),
      loadingRef: loading,
    });
  };

  const logout = async () => {
    loading.value = true;
    try {
      await firebaseAuth.signOut();
    } catch (error) {}
    loading.value = false;
  };

  const fetchCurrentUser = async () => {
    const { response } = await fetchApi<IUserFull>(
      {
        url: "/users/me",
        method: "GET",
      },
      {
        loadingRef: loading,
      }
    );

    return { response };
  };

  const handleFetchCurrentUser = async (token: string) => {
    console.log(
      "------------- 🟢 START SESSION handleFetchCurrentUser -------------"
    );
    console.log("❗ handleFetchCurrentUser token -->", !!token);
    // tokenCookie.value = token ?? ""; // SET TOKEN TO COOKIES
    const { response } = await fetchCurrentUser();

    if (response.data) {
      currentUser.value = response.data;
    }

    if (!response.data) {
      console.error("❗ auth error -->", response.error);
      toast.error("You need to sign in again");
      currentUser.value = null;
    }
    console.log("------------- 🔴 END handleFetchCurrentUser -------------");
  };

  if (!isServerSide) {
    firebaseAuth.onAuthStateChanged(async (user) => {
      console.log(
        "------------- 🟢 START SESSION onAuthStateChanged -------------"
      );
      console.log("❗ onAuthStateChanged user -->", user);
      if (user) {
        const token = await user.getIdToken();
        tokenCookie.value = token;
        // await handleFetchCurrentUser(token);
      } else {
        tokenCookie.value = "";
        currentUser.value = null;
      }
      console.log("------------- 🔴 END onAuthStateChanged -------------");
    });
  }

  return {
    currentUser,
    loading,
    login,
    logout,
    fetchCurrentUser,
    handleFetchCurrentUser,
  };
});
