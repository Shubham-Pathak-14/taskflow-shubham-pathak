import { createContext, useContext, useState } from "react";
import type { User } from "../types";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("tf_user") ?? "null"),
  );
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("tf_token"),
  );

  const login = (token: string, user: User) => {
    localStorage.setItem("tf_token", token);
    localStorage.setItem("tf_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
