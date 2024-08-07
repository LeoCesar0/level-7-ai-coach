import type { IUserFull } from "@common/schemas/user/user";
import { signInWithEmailAndPassword, type Unsubscribe } from "firebase/auth";
import type { ISignIn } from "~/@schemas/auth";
import { handleUnexpectedError } from "~/handlers/handleUnexpectedError";
import { makeStoreKey } from "~/helpers/makeStoreKey";
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
  const authPromiseResolved = ref(false);

  watch(
    currentUser,
    async (user) => {
      console.log("❗ watch currentUser -->", user);

      if (user && !user.active) {
        await logout();
        toast.error("Your account is not active. Please contact support.");
        return;
      }

      if (user && (route.path === "/" || route.path === "/sign-in")) {
        return await navigateTo(ROUTE.dashboard.href);
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    [currentUser, authToken],
    async ([user, authToken]) => {
      if (user && !authToken) {
        console.log(
          "------------- 🟢 START SESSION REMOVE CURRENT USER -------------"
        );
        currentUser.value = null;
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  // const isServerSide = getIsServerSide();
  const isServerSide = typeof window === "undefined";

  const logout = async ({ expired }: { expired?: boolean } = {}) => {
    loading.value = true;
    try {
      // window.alert('🔌 LOG OUT')
      await firebaseAuth.signOut();
      authToken.value = "";
      currentUser.value = null;
      authPromiseResolved.value = false;
      console.log(
        "❗ authPromiseResolved SET TO FALSE -->",
        authPromiseResolved
      );
    } catch (error) {}
    await navigateTo(ROUTE["sign-in"].href);
    loading.value = false;
    await nextTick();
    if (expired) {
      toast.error("Your session has expired. Please sign in again.");
    }
  };

  const fetchCurrentUser = async () => {
    const response = await fetchApi<IUserFull>({
      url: "/users/me",
      method: "GET",
      loadingRefs: [loading],
    });

    return response;
  };
  const refreshCurrentUser = async () => {
    const res = await fetchCurrentUser();
    if (res.data) {
      console.log("❗ refresh res -->", res);
      currentUser.value = res.data;
    }
  };

  const handleFetchCurrentUser = async () => {
    const response = await fetchCurrentUser();

    if (response.data) {
      currentUser.value = response.data;
    }

    if (!response.data) {
      console.error("❌ auth error -->", response.error);
      currentUser.value = null;
    }
  };

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

  const handleSessionExpired = () => {
    logout({ expired: true });
  };

  // --------------------------
  // FIREBASE AUTH OBSERVER
  // --------------------------

  // if (!isServerSide) {
  //   firebaseAuth.onIdTokenChanged(async (user) => {
  //     console.log("❗❗❗ Here onIdTokenChanged 1");
  //     if (user) {
  //       const token = await user.getIdToken();
  //       authToken.value = token;
  //     } else {
  //       authToken.value = "";
  //       currentUser.value = null;
  //     }
  //   });
  // }

  let resolveFirstStateChange = ref<(value: any) => void>();
  const firebaseTokenPromise = ref(
    new Promise<any>((resolve) => {
      resolveFirstStateChange.value = resolve;
    })
  );
  let unsubscribe = ref<Unsubscribe | undefined>(undefined);
  unsubscribe.value = firebaseAuth.onIdTokenChanged(async (user) => {
    if (user) {
      // window.alert("✅ HAS USER!");
      const token = await user.getIdToken();
      authToken.value = token;
      await handleFetchCurrentUser();
    } else {
      // window.alert("❌ NOT HAS USER!");
      authToken.value = "";
      currentUser.value = null;
    }
    if (!authPromiseResolved.value && resolveFirstStateChange.value) {
      resolveFirstStateChange.value(user);
      authPromiseResolved.value = true;
    }
  });
  // const firebaseTokenPromise = ref<Promise<any>>(
  //   new Promise((resolve, reject) => {
  //     unsubscribe = firebaseAuth.onIdTokenChanged(async (user) => {
  //       if (user) {
  //         const token = await user.getIdToken();
  //         authToken.value = token;
  //       } else {
  //         authToken.value = "";
  //         currentUser.value = null;
  //       }
  //       resolve(user);
  //     });
  //   })
  // );

  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    currentUser,
    loading,
    login,
    logout,
    fetchCurrentUser,
    refreshCurrentUser,
    handleFetchCurrentUser,
    handleSessionExpired,
    firebaseTokenPromise,
    authPromiseResolved,
  };
});
