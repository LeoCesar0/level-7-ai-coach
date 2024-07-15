import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

export const useFirebase = () => {
  const runtime = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: runtime.public.firebaseApiKey,
    authDomain: "level-7-e9ae3.firebaseapp.com",
    projectId: "level-7-e9ae3",
    storageBucket: "level-7-e9ae3.appspot.com",
    messagingSenderId: "197751569238",
    appId: runtime.public.firebaseAppId,
    measurementId: "G-G7PJLC2YV5",
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseAuth = getAuth(firebaseApp);
  // export const firebaseDB = getFirestore(firebaseApp);
  // export const firebaseStorage = getStorage(firebaseApp);

  if (typeof window !== "undefined") {
    setPersistence(firebaseAuth, browserLocalPersistence);
  }
  return {
    firebaseApp,
    firebaseAuth,
  };
};
