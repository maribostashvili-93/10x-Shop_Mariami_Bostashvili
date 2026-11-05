import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useWishlist } from "../hooks/useWishlist";
import { useLogout } from "../hooks/useLogout";
import { useToast } from "../hooks/useToast";
import FormField from "../components/ui/FormField";
import ThemeToggle from "../components/ui/ThemeToggle";
import { reviewStorage } from "../services/reviewStorage";
import type { ProfileData } from "../services/profileStorage";
import { isValidEmail, isValidPhone, type FieldErrors } from "../utils/validation";

/** Profile rules and exact messages from the specification (P7.2). */
function validateProfile(values: ProfileData): FieldErrors<ProfileData> {
  const errors: FieldErrors<ProfileData> = {};
  if (values.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (values.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!isValidEmail(values.email)) errors.email = "Please enter a valid email address";
  if (values.phone.trim() && !isValidPhone(values.phone)) errors.phone = "Please enter a valid phone number";
  return errors;
}

const FIELDS: { id: keyof ProfileData; label: string; type: string; autoComplete: string }[] = [
  { id: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { id: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
];

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { orders, clearOrders } = useOrders();
  const { clearCart } = useCart();
  const { products: wishlist } = useWishlist();
  const logout = useLogout();
  const { showToast } = useToast();
  const [values, setValues] = useState<ProfileData>(profile);
  const [errors, setErrors] = useState<FieldErrors<ProfileData>>({});

  if (!user) {
    return <Navigate to="/login" state={{ from: "/profile" }} replace />;
  }

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || user.username;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
    showToast("Profile saved ✓");
  }

  function clearLocalData() {
    if (!window.confirm("Clear your cart, orders and reviews saved in this browser? This cannot be undone.")) return;
    // Keeps the session and the theme, as the specification requires.
    clearCart();
    clearOrders();
    reviewStorage.clear();
    showToast("Local data cleared", "info");
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-violet-100 bg-white p-6 sm:flex-row sm:items-center sm:p-10">
        <span aria-hidden="true" className="flex size-20 shrink-0 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">My profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{displayName}</h1>
          <p className="mt-1 text-slate-600">Signed in as {user.username}{profile.email ? ` · ${profile.email}` : ""}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/orders" className="rounded-2xl bg-violet-50 p-5 transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700">
          <p className="text-sm text-slate-600">My orders</p>
          <p className="mt-2 text-2xl font-bold text-violet-800">{orders.length}</p>
        </Link>
        <Link to="/wishlist" className="rounded-2xl bg-violet-50 p-5 transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700">
          <p className="text-sm text-slate-600">Wishlist</p>
          <p className="mt-2 text-2xl font-bold text-violet-800">{wishlist.length}</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Edit profile</h2>
          {FIELDS.map(({ id, label, type, autoComplete }) => (
            <FormField key={id} id={`profile-${id}`} label={label} error={errors[id]}>
              <input
                id={`profile-${id}`}
                type={type}
                autoComplete={autoComplete}
                value={values[id]}
                aria-invalid={Boolean(errors[id])}
                aria-describedby={errors[id] ? `profile-${id}-error` : undefined}
                onChange={(event) => {
                  const value = event.target.value;
                  setValues((current) => ({ ...current, [id]: value }));
                  setErrors((current) => ({ ...current, [id]: undefined }));
                }}
                className={`min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${errors[id] ? "border-amber-600" : "border-slate-300"}`}
              />
            </FormField>
          ))}
          <button type="submit" className="min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
            Save changes
          </button>
        </form>

        <div className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
            <p className="mt-1 text-sm text-slate-600">Switch between the light and dark theme.</p>
            <div className="mt-3"><ThemeToggle showLabel /></div>
          </div>
          <div className="border-t border-slate-200 pt-5">
            <h2 className="text-xl font-semibold text-slate-900">Local data</h2>
            <p className="mt-1 text-sm text-slate-600">Removes the cart, orders and reviews saved in this browser. You stay signed in.</p>
            <button type="button" onClick={clearLocalData} className="mt-3 min-h-11 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">
              Clear local data
            </button>
          </div>
          <div className="border-t border-slate-200 pt-5">
            <button type="button" onClick={logout} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
              Log out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
