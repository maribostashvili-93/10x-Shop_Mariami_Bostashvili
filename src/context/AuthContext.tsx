import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { StorageService } from "../services/StorageService";
import { STORAGE_KEYS } from "../services/storageKeys";
import { profileStorage, type ProfileData } from "../services/profileStorage";
import { AuthContext } from "./auth-context";

function isUser(value: unknown): value is User | null {
  return value === null || (typeof value === "object" && "username" in value && typeof value.username === "string");
}

// Only the username is remembered; no password or token is ever stored.
const userStorage = new StorageService<User | null>(STORAGE_KEYS.user, isUser, null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userStorage.load());
  const [profile, setProfile] = useState<ProfileData>(() => profileStorage.load());

  function login(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    const nextUser = { username: trimmedUsername };
    setUser(nextUser);
    userStorage.save(nextUser);
  }

  function logout() {
    setUser(null);
    userStorage.clear();
  }

  function updateProfile(nextProfile: ProfileData) {
    setProfile(nextProfile);
    profileStorage.save(nextProfile);
  }

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
