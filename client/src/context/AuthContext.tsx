import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";


export interface User {
  id: number;

  name: string;

  email: string;

  role:
    | "ADMIN"
    | "ASSET_MANAGER"
    | "DEPARTMENT_HEAD"
    | "EMPLOYEE";

  departmentId:
    number | null;
}


interface AuthContextType {
  user:
    User | null;

  token:
    string | null;

  isAuthenticated:
    boolean;

  login:
    (
      user: User,
      token: string,
    ) => void;

  logout:
    () => void;
}


const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);


interface AuthProviderProps {
  children:
    ReactNode;
}


export const AuthProvider = ({
  children,
}: AuthProviderProps) => {

  const [user, setUser] =
    useState<User | null>(
      () => {
        const savedUser =
          localStorage.getItem(
            "assetflow_user",
          );

        if (!savedUser) {
          return null;
        }

        try {
          return JSON.parse(
            savedUser,
          );
        } catch {
          localStorage.removeItem(
            "assetflow_user",
          );

          return null;
        }
      },
    );


  const [token, setToken] =
    useState<string | null>(
      () => {
        return (
          localStorage.getItem(
            "assetflow_token",
          )
        );
      },
    );


  const login = (
    loggedInUser: User,

    authenticationToken:
      string,
  ) => {

    localStorage.setItem(
      "assetflow_user",

      JSON.stringify(
        loggedInUser,
      ),
    );


    localStorage.setItem(
      "assetflow_token",

      authenticationToken,
    );


    setUser(
      loggedInUser,
    );


    setToken(
      authenticationToken,
    );
  };


  const logout = () => {

    localStorage.removeItem(
      "assetflow_user",
    );


    localStorage.removeItem(
      "assetflow_token",
    );


    setUser(
      null,
    );


    setToken(
      null,
    );
  };


  return (
    <AuthContext.Provider
      value={{
        user,

        token,

        isAuthenticated:
          Boolean(
            user && token,
          ),

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context =
    useContext(
      AuthContext,
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }


  return context;
};