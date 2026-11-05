import { StorageService } from "./StorageService";
import { isRecord } from "../api/client";
import { STORAGE_KEYS } from "./storageKeys";

/** Editable profile details, stored only in this browser. */
export type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** ISO date of the first sign-in in this browser. */
  memberSince?: string;
  /** ISO date of the last "Save changes". */
  updatedAt?: string;
};

/** The fields the profile form can change. */
export type EditableProfile = Pick<ProfileData, "firstName" | "lastName" | "email" | "phone">;

export const emptyProfile: ProfileData = { firstName: "", lastName: "", email: "", phone: "" };

function isProfileData(value: unknown): value is ProfileData {
  return (
    isRecord(value) &&
    (["firstName", "lastName", "email", "phone"] as const).every((key) => typeof value[key] === "string") &&
    (["memberSince", "updatedAt"] as const).every((key) => value[key] === undefined || typeof value[key] === "string")
  );
}

export const profileStorage = new StorageService<ProfileData>(STORAGE_KEYS.profile, isProfileData, emptyProfile);

export function readProfile(): ProfileData {
  return profileStorage.load();
}
