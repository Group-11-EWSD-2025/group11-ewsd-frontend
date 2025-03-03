import { loginState } from "@/recoil/auth";
import React, { createContext, useContext } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";

type AuthContextType = {
  authState: any;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useRecoilValue(loginState);
  const resetAuthState = useResetRecoilState(loginState);

  function logout() {
    resetAuthState();
  }

  return (
    <AuthContext.Provider value={{ authState, logout }}>
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
