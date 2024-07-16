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
    await handleToastAnyPromise({
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
    const token = tokenCookie.value;
    if (!token) {
      currentUser.value = null;
      return null;
    }
    const { data: res, error } = await fetchApi<IUserFull>({
      url: "/users/me",
      loadingRef: loading,
    });
    if (res.value?.data) {
      currentUser.value = res.value.data;
      return currentUser.value;
    } else {
      currentUser.value = null;
      toast.error("Error getting user");
      console.error("❗ auth error -->", error.value, res.value?.error);
      return null;
    }
  };

  if (!isServerSide) {
    // firebaseAuth.beforeAuthStateChanged((user) => {
    //   loading.value = true;
    // });
    // firebaseAuth.onAuthStateChanged(async (user) => {
    //   if (user) {
    //     const token = await user.getIdToken();
    //     tokenCookie.value = token ?? "";
    //     if (user && currentUser?.value?.firebaseId !== user.uid) {
    //       const { data: res, error } = await fetchApi<IUserFull>({
    //         url: "/users/me",
    //         loadingRef: loading,
    //       });
    //       if (res.value?.data) {
    //         currentUser.value = res.value.data;
    //       } else {
    //         currentUser.value = null;
    //         toast.error("Error getting user");
    //         console.error("❗ auth error -->", error.value, res.value?.error);
    //       }
    //     }
    //   } else {
    //     tokenCookie.value = "";
    //     currentUser.value = null;
    //   }
    // });
  }

  return {
    currentUser,
    loading,
    login,
    logout,
    fetchCurrentUser,
  };
});

// export const useUser = () => {
//   const { firebaseAuth } = useFirebase();
//   const currentUser = ref<IUserFull | null>(null);
//   const loading = ref(false);
//   const { handleToastAnyPromise } = useToast();
//   const tokenCookie = useAuthToken();
//   const { fetchApi } = useFetchApi();
//   const { toast } = useToast();

//   // const isServerSide = getIsServerSide();
//   const isServerSide = typeof window === "undefined";

//   const login = async (values: ISignIn) => {
//     const { email, password } = values;
//     await handleToastAnyPromise({
//       promise: signInWithEmailAndPassword(firebaseAuth, email, password),
//       loadingRef: loading,
//     });
//   };

//   const logout = async () => {
//     loading.value = true;
//     try {
//       await firebaseAuth.signOut();
//     } catch (error) {}
//     loading.value = false;
//   };
//   if (!isServerSide) {
//     firebaseAuth.beforeAuthStateChanged((user) => {
//       loading.value = true;
//     });

//     firebaseAuth.onAuthStateChanged(async (user) => {
//       if (user) {
//         const token = await user.getIdToken();
//         tokenCookie.value = token ?? "";

//         if (user && currentUser?.value?.firebaseId !== user.uid) {
//           const { data: res, error } = await fetchApi<IUserFull>({
//             url: "/users/me",
//             loadingRef: loading,
//           });
//           if (res.value?.data) {
//             currentUser.value = res.value.data;
//           } else {
//             currentUser.value = null;
//             toast.error("Error getting user");
//             console.error("❗ auth error -->", error.value, res.value?.error);
//           }
//         }
//       } else {
//         tokenCookie.value = "";
//         currentUser.value = null;
//       }
//     });
//   }

//   return {
//     currentUser,
//     loading,
//     login,
//     logout,
//   };
// };
