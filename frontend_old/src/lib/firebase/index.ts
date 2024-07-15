import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "level-7-e9ae3.firebaseapp.com",
  projectId: "level-7-e9ae3",
  storageBucket: "level-7-e9ae3.appspot.com",
  messagingSenderId: "197751569238",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-G7PJLC2YV5",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
// export const firebaseDB = getFirestore(firebaseApp);
// export const firebaseStorage = getStorage(firebaseApp);

if (typeof window !== "undefined") {
  setPersistence(firebaseAuth, browserLocalPersistence);
}

export { firebaseAuth };
// const analytics = getAnalytics(app);
