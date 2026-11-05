import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

type SavedProfile = {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
};

const PROFILE_KEY = "10x-profile";

function readProfile(): SavedProfile {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}");
    return typeof data === "object" && data !== null ? (data as SavedProfile) : {};
  } catch {
    return {};
  }
}

const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700";

/** Saves delivery details locally; Checkout and Profile read them back. */
export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const profile = readProfile();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextProfile: SavedProfile = {
      fullName: String(data.get("fullName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    setSaved(true);
  }

  function handlePhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => localStorage.setItem("10x-profile-photo", String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-2xl border border-violet-100 bg-white px-6 py-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Your account</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Account settings</h1>
      <p className="mt-3 text-sm text-slate-600">These details are stored only in this browser and pre-fill checkout.</p>
      <form className="mt-8 max-w-xl space-y-5" onSubmit={handleSubmit} onChange={() => setSaved(false)}>
        <div>
          <label htmlFor="profile-photo" className="block text-sm font-medium text-slate-900">Profile photo</label>
          <input id="profile-photo" type="file" accept="image/*" onChange={(event) => handlePhoto(event.target.files?.[0])} className={`${inputClass} py-2 text-sm`} />
        </div>
        <div>
          <label htmlFor="settings-full-name" className="block text-sm font-medium text-slate-900">Full name</label>
          <input id="settings-full-name" name="fullName" autoComplete="name" defaultValue={profile.fullName ?? user?.username ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="settings-email" className="block text-sm font-medium text-slate-900">Email</label>
          <input id="settings-email" name="email" type="email" autoComplete="email" defaultValue={profile.email ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="settings-address" className="block text-sm font-medium text-slate-900">Delivery address</label>
          <input id="settings-address" name="address" autoComplete="street-address" defaultValue={profile.address ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="settings-city" className="block text-sm font-medium text-slate-900">City</label>
          <input id="settings-city" name="city" autoComplete="address-level2" defaultValue={profile.city ?? ""} className={inputClass} />
        </div>
        <button type="submit" className="min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
          Save changes
        </button>
        <p role="status" className="text-sm text-violet-800">{saved ? "Your details have been saved." : ""}</p>
      </form>
    </section>
  );
}
