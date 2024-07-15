"use client";
import { firebaseAuth } from "@/lib/firebase";
import { User } from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";

export type IUseAuthValues = {
  currentUser: User | null;
};
export type IUseAuthValuesActions = {
  setState: React.Dispatch<React.SetStateAction<IUseAuthValues>>;
};

export type IUseAuth = IUseAuthValues & IUseAuthValuesActions;

const initialValues: IUseAuthValues = {
  currentUser: null,
};

const AuthContext = createContext<IUseAuth>(initialValues as IUseAuth);

type IAuthContextProvider = {
  children: React.ReactNode;
};

export const AuthContextProvider: React.FC<IAuthContextProvider> = ({
  children,
}) => {
  const [state, setState] = useState<IUseAuthValues>(initialValues);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      console.log("❗ user changed -->", user);
      setState({ currentUser: user });
      if (!user) return;
      const token = await user.getIdToken();
      console.log("❗ token -->", !!token);
      if (token) {
        fetch("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("❗ data me -->", data);
          })
          .catch((err) => {
            console.log("❗ catch err -->", err);
          });
      }
    });
    // fetch("http://localhost:8000/api/playground/test")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("❗ data test -->", data);
    //   })
    //   .catch((err) => {
    //     console.log("❗ catch err -->", err);
    //   });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
