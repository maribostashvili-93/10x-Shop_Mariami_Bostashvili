import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { StorageService } from "../services/StorageService";
import { STORAGE_KEYS } from "../services/storageKeys";
import {
  emptyProfile,
  loadProfile,
  migrateLegacyProfile,
  saveProfile as storeProfile,
  type EditableProfile,
  type ProfileData,
} from "../services/profileStorage";
import { AuthContext } from "./auth-context";

function isUser(value: unknown): value is User | null {
  return value === null || (typeof value === "object" && "username" in value && typeof value.username === "string");
}

// Only the username is remembered; no password or token is ever stored.
const userStorage = new StorageService<User | null>(STORAGE_KEYS.user, isUser, null);

/** The signed-in shopper's own profile; a first sign-in records "member since" once. */
function profileFor(username: string): ProfileData {
  const saved = loadProfile(username);
  if (saved.memberSince) return saved;
  const withDate = { ...saved, memberSince: new Date().toISOString() };
  storeProfile(username, withDate);
  return withDate;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userStorage.load());
  const [profile, setProfile] = useState<ProfileData>(() => {
    const current = userStorage.load();
    migrateLegacyProfile(current?.username ?? null);
    return current ? profileFor(current.username) : emptyProfile;
  });

  function login(username: string) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    const nextUser = { username: trimmedUsername };
    setUser(nextUser);
    userStorage.save(nextUser);
    setProfile(profileFor(trimmedUsername));
  }

  function logout() {
    setUser(null);
    setProfile(emptyProfile);
    userStorage.clear();
  }

  function updateProfile(fields: EditableProfile) {
    if (!user) return;
    const next = { ...profile, ...fields, updatedAt: new Date().toISOString() };
    setProfile(next);
    storeProfile(user.username, next);
  }

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
