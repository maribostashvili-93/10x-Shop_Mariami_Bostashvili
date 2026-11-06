import { StorageService } from "./StorageService";
import { isRecord } from "../api/client";
import { STORAGE_KEYS } from "./storageKeys";
import type { PaymentMethod } from "../types/order";

/** Editable profile details, stored only in this browser. */
export type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  paymentMethod?: PaymentMethod;
  /** ISO date of the first sign-in in this browser. */
  memberSince?: string;
  /** ISO date of the last "Save changes". */
  updatedAt?: string;
};

/** The fields the profile form can change. */
export type EditableProfile = Pick<ProfileData, "firstName" | "lastName" | "email" | "phone" | "address" | "city" | "postalCode" | "country" | "paymentMethod">;

export const emptyProfile: ProfileData = { firstName: "", lastName: "", email: "", phone: "" };

function isProfileData(value: unknown): value is ProfileData {
  return (
    isRecord(value) &&
    (["firstName", "lastName", "email", "phone"] as const).every((key) => typeof value[key] === "string") &&
    (["memberSince", "updatedAt"] as const).every((key) => value[key] === undefined || typeof value[key] === "string")
  );
}

type ProfilesByUser = Record<string, ProfileData>;

function isProfilesByUser(value: unknown): value is ProfilesByUser {
  return isRecord(value) && Object.values(value).every(isProfileData);
}

// One profile per username, so a second shopper in the same browser never sees
// (or overwrites) the first shopper's name, contact details or address.
const profilesStorage = new StorageService<ProfilesByUser>(STORAGE_KEYS.profiles, isProfilesByUser, {});

// Before profiles were per user, one shared profile was kept under `shop_profile`.
const legacyProfileStorage = new StorageService<ProfileData | null>(
  STORAGE_KEYS.profile,
  (value): value is ProfileData | null => value === null || isProfileData(value),
  null,
);

/**
 * Moves the old shared profile to `username` (the shopper who was signed in when it
 * was saved) once, then deletes it so it can never be shown to anyone else.
 */
export function migrateLegacyProfile(username: string | null): void {
  const legacy = legacyProfileStorage.load();
  if (!legacy) return;
  if (username) {
    const profiles = profilesStorage.load();
    if (!profiles[username]) profilesStorage.save({ ...profiles, [username]: legacy });
  }
  legacyProfileStorage.clear();
}

export function loadProfile(username: string): ProfileData {
  return profilesStorage.load()[username] ?? emptyProfile;
}

export function saveProfile(username: string, profile: ProfileData): void {
  profilesStorage.save({ ...profilesStorage.load(), [username]: profile });
}
