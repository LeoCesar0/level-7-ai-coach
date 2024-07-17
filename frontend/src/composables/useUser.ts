import type { AppResponse } from "@common/schemas/app";
import type { IUserFull } from "@common/schemas/userFull";
import { EXCEPTION_CODE } from "@common/static/exceptions";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { ISignIn } from "~/@schemas/auth";
import { makeStoreKey } from "~/helpers/makeStoreKey";

// makeStoreKey("users")

export const useUser = defineStore("@lvl7-users", () => {
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

    console.log("❗ LOGIN response -->", response);

    // if(response.data?.user){
    //   const idToken = response.data.user.getIdToken()
    // }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await firebaseAuth.signOut();
    } catch (error) {}
    loading.value = false;
  };

  const fetchCurrentUser = async () => {
    const { response } = await fetchApi<IUserFull>({
      url: "/users/me",
      loadingRef: loading,
    });

    console.log("❗ FETCH USER response -->", response);

    return { response };
    // // --------------------------
    // // CASE ERROR
    // // --------------------------
    // if (res.value?.error?.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
    //   console.log("❗❗❗ Here EXPIRED TOKEN");
    //   tokenCookie.value = "";
    // }
    // currentUser.value = null;
    // console.error("❗ auth error -->", error.value, res.value?.error);
    // return null;
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
