import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("10x-user") ?? "null") as User | null; } catch { return null; }
  });

  function login(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    const nextUser = { username: trimmedUsername };
    setUser(nextUser);
    localStorage.setItem("10x-user", JSON.stringify(nextUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("10x-user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
