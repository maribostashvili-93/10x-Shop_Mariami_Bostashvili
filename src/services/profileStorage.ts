import { StorageService } from "./StorageService";
import { STORAGE_KEYS } from "./storageKeys";

/** Editable profile details, stored only in this browser. */
export type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export const emptyProfile: ProfileData = { firstName: "", lastName: "", email: "", phone: "" };

function isProfileData(value: unknown): value is ProfileData {
  if (typeof value !== "object" || value === null) return false;
  const profile = value as Record<string, unknown>;
  return (["firstName", "lastName", "email", "phone"] as const).every((key) => typeof profile[key] === "string");
}

export const profileStorage = new StorageService<ProfileData>(STORAGE_KEYS.profile, isProfileData, emptyProfile);

export function readProfile(): ProfileData {
  return profileStorage.load();
}
