import { loginState } from "@/recoil/auth";
import { TLoginState } from "@/types";
import React, { createContext, useContext } from "react";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

type AuthContextType = {
  authState: TLoginState;
  setAuthState: React.Dispatch<React.SetStateAction<TLoginState>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useRecoilValue(loginState);
  const setAuthState = useSetRecoilState(loginState);
  const resetAuthState = useResetRecoilState(loginState);

  // const logoutMutation = useLogout({
  //   mutationConfig: {
  //     onSuccess: () => {
  //       resetAuthState();
  //     },
  //   },
  // });

  function logout() {
    resetAuthState();
    // logoutMutation.mutate(undefined, {});
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
