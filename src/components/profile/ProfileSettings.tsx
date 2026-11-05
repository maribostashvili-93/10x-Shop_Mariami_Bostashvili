import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useOrders } from "../../hooks/useOrders";
import { useLogout } from "../../hooks/useLogout";
import { useToast } from "../../hooks/useToast";
import FormField from "../ui/FormField";
import ThemeToggle from "../ui/ThemeToggle";
import { reviewStorage } from "../../services/reviewStorage";
import type { EditableProfile } from "../../services/profileStorage";
import { isValidEmail, isValidPhone, type FieldErrors } from "../../utils/validation";

/** Profile rules and exact messages from the specification (P7.2). */
function validateProfile(values: EditableProfile): FieldErrors<EditableProfile> {
  const errors: FieldErrors<EditableProfile> = {};
  if (values.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (values.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!isValidEmail(values.email)) errors.email = "Please enter a valid email address";
  if (values.phone.trim() && !isValidPhone(values.phone)) errors.phone = "Please enter a valid phone number";
  return errors;
}

const FIELDS: { id: keyof EditableProfile; label: string; type: string; autoComplete: string }[] = [
  { id: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { id: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
];

/** Settings tab: edit details (P7.2), theme, clear local data and log out. */
function ProfileSettings() {
  const { profile, updateProfile } = useAuth();
  const { clearOrders } = useOrders();
  const { clearCart } = useCart();
  const logout = useLogout();
  const { showToast } = useToast();
  const [values, setValues] = useState<EditableProfile>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
  });
  const [errors, setErrors] = useState<FieldErrors<EditableProfile>>({});

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
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-3xl border border-violet-100 bg-white p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Personal details</h2>
          <p className="mt-1 text-sm text-slate-600">Your name appears in the header and pre-fills checkout.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
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
        </div>
        <button type="submit" className="min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
          Save changes
        </button>
      </form>

      <div className="h-fit space-y-5 rounded-3xl border border-violet-100 bg-white p-6 sm:p-8">
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
  );
}

export default ProfileSettings;
