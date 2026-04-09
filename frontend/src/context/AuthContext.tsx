import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api/client";

type AuthContextType = {
  token: string | null;
  user: { id: string; email: string; streak?: number } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("token");
      if (stored) {
        try {
          const res = await authAPI.getMe(stored);
          setToken(stored);
          setUser(res.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser({ id: res.data.id, email: res.data.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
