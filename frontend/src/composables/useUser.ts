import {
  signInWithEmailAndPassword,
  type User as IFirebaseUser,
} from "firebase/auth";
import type { ISignIn } from "~/@schemas/auth";

export const useUser = () => {
  const { firebaseAuth } = useFirebase();
  const user = ref();
  const firebaseUser = ref<IFirebaseUser | null>(null);
  const loading = ref(false);

  firebaseAuth.beforeAuthStateChanged((user) => {
    loading.value = true;
  });

  firebaseAuth.onAuthStateChanged((user) => {
    firebaseUser.value = user;
    loading.value = false;
  });

  const login = async (values: ISignIn) => {
    const { email, password } = values;
    loading.value = true;
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {}
    loading.value = false;
  };

  const logout = async () => {
    loading.value = true;
    try {
      await firebaseAuth.signOut();
    } catch (error) {}
    loading.value = false;
  };

  return {
    user,
    firebaseUser,
    login,
    logout,
  };
};
