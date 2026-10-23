import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function login(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    setUser({ username: trimmedUsername });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
