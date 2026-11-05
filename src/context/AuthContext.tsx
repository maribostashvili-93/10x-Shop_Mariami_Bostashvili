import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { StorageService } from "../services/StorageService";
import { STORAGE_KEYS } from "../services/storageKeys";
import { profileStorage, type EditableProfile, type ProfileData } from "../services/profileStorage";
import { AuthContext } from "./auth-context";

function isUser(value: unknown): value is User | null {
  return value === null || (typeof value === "object" && "username" in value && typeof value.username === "string");
}

// Only the username is remembered; no password or token is ever stored.
const userStorage = new StorageService<User | null>(STORAGE_KEYS.user, isUser, null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userStorage.load());
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = profileStorage.load();
    // Shoppers who signed in before "member since" existed get today's date once.
    if (userStorage.load() && !saved.memberSince) {
      const withDate = { ...saved, memberSince: new Date().toISOString() };
      profileStorage.save(withDate);
      return withDate;
    }
    return saved;
  });

  function saveProfile(next: ProfileData) {
    setProfile(next);
    profileStorage.save(next);
  }

  function login(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    const nextUser = { username: trimmedUsername };
    setUser(nextUser);
    userStorage.save(nextUser);
    if (!profile.memberSince) saveProfile({ ...profile, memberSince: new Date().toISOString() });
  }

  function logout() {
    setUser(null);
    userStorage.clear();
  }

  function updateProfile(fields: EditableProfile) {
    saveProfile({ ...profile, ...fields, updatedAt: new Date().toISOString() });
  }

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
