"use client";
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
    // You can fetch the user data here and set it
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
