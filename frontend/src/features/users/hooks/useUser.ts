import { User } from "firebase/auth";
import { create } from "zustand";

type IUseUser = {
  firebaseUser: User | null;
  setFirebaseUser: (user: User) => void;
};

export const useUser = create<IUseUser>((set) => ({
  firebaseUser: null,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
}));
