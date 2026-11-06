import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useOrders } from "../../hooks/useOrders";
import { useLogout } from "../../hooks/useLogout";
import { useToast } from "../../hooks/useToast";
import FormField from "../ui/FormField";
import ThemeToggle from "../ui/ThemeToggle";
import { removeReviewsBy } from "../../services/reviewStorage";
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

const SHIPPING_FIELDS: { id: keyof EditableProfile; label: string; autoComplete: string }[] = [
  { id: "address", label: "Shipping address", autoComplete: "street-address" },
  { id: "city", label: "City", autoComplete: "address-level2" },
  { id: "postalCode", label: "Postal code", autoComplete: "postal-code" },
];

/** Settings tab: edit details (P7.2), theme, clear local data and log out. */
function ProfileSettings() {
  const { user, profile, updateProfile } = useAuth();
  const { clearOrders } = useOrders();
  const { clearCart } = useCart();
  const logout = useLogout();
  const { showToast } = useToast();
  const [values, setValues] = useState<EditableProfile>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address ?? "",
    city: profile.city ?? "",
    postalCode: profile.postalCode ?? "",
    country: profile.country ?? "Georgia",
    paymentMethod: profile.paymentMethod ?? "card",
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
        address: values.address?.trim(),
        city: values.city?.trim(),
        postalCode: values.postalCode?.trim(),
        country: values.country,
        paymentMethod: values.paymentMethod,
    });
    showToast("Profile saved ✓");
  }

  function clearLocalData() {
    if (!user || !window.confirm("Clear the cart and your orders and reviews saved in this browser? This cannot be undone.")) return;
    // Keeps the session and the theme, as the specification requires. Orders and
    // reviews of other shoppers in this browser are not touched.
    clearCart();
    clearOrders();
    removeReviewsBy(user.username);
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
        <div className="border-t border-slate-200 pt-5">
          <h2 className="text-xl font-semibold text-slate-900">Shipping and payment</h2>
          <p className="mt-1 text-sm text-slate-600">These details pre-fill your next checkout. Payment is simulated for this demo.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {SHIPPING_FIELDS.map(({ id, label, autoComplete }) => (
              <FormField key={id} id={`profile-${id}`} label={label} error={errors[id]}>
                <input id={`profile-${id}`} autoComplete={autoComplete} value={values[id] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [id]: event.target.value }))} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700" />
              </FormField>
            ))}
            <FormField id="profile-country" label="Country">
              <input id="profile-country" value={values.country ?? "Georgia"} onChange={(event) => setValues((current) => ({ ...current, country: event.target.value }))} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700" />
            </FormField>
            <FormField id="profile-paymentMethod" label="Payment method">
              <select id="profile-paymentMethod" value={values.paymentMethod ?? "card"} onChange={(event) => setValues((current) => ({ ...current, paymentMethod: event.target.value as "card" | "cash-on-delivery" }))} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700">
                <option value="card">Card (demo)</option>
                <option value="cash-on-delivery">Cash on delivery</option>
              </select>
            </FormField>
          </div>
        </div>
      </form>

      <div className="h-fit space-y-5 rounded-3xl border border-violet-100 bg-white p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
          <p className="mt-1 text-sm text-slate-600">Switch between the light and dark theme.</p>
          <div className="mt-3"><ThemeToggle showLabel /></div>
        </div>
        <div className="border-t border-slate-200 pt-5">
          <h2 className="text-xl font-semibold text-slate-900">Local data</h2>
          <p className="mt-1 text-sm text-slate-600">Removes the cart and your orders and reviews saved in this browser. You stay signed in.</p>
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
