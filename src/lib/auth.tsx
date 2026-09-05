import { createContext, useContext, useState, type ReactNode } from "react";
import { ACCOUNT } from "./account";

const STORAGE_KEY = "varo_session";

function readSession() {
  try {
    return typeof window !== "undefined" && !!window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { fullName: string; shortName: string; initials: string; email: string };
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);

  const login = (email?: string, password?: string) => {
    if (email !== undefined || password !== undefined) {
      const ok =
        (email ?? "").trim().toLowerCase() === ACCOUNT.email &&
        (password ?? "") === ACCOUNT.password;
      if (!ok) return false;
    }
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: {
          fullName: ACCOUNT.fullName,
          shortName: ACCOUNT.shortName,
          initials: ACCOUNT.initials,
          email: ACCOUNT.email,
        },
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
