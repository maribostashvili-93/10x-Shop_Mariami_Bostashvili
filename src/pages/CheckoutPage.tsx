import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { getCatalogProducts } from "../api/products";
import type { Product } from "../types/product";
import type { ShippingInfo } from "../types/order";
import { Cart } from "../models/Cart";
import { describeOptions } from "../models/productOptions";
import type { Order } from "../models/Order";
import ProductCard from "../components/products/ProductCard";
import OrderTotals from "../components/cart/OrderTotals";
import FormField from "../components/ui/FormField";
import type { ProfileData } from "../services/profileStorage";
import { COUNTRIES, validateShipping, type FieldErrors } from "../utils/validation";
import { formatPrice, getFinalPrice } from "../utils/formatPrice";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** Prefill from the signed-in shopper's own profile only. */
function initialFields(username: string, profile: ProfileData): ShippingInfo {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return {
    fullName: fullName || username,
    email: profile.email,
    phone: profile.phone,
    address: profile.address ?? "",
    city: profile.city ?? "",
    postalCode: profile.postalCode ?? "",
    country: profile.country ?? "Georgia",
    paymentMethod: profile.paymentMethod ?? "card",
  };
}

function CheckoutPage() {
  const { user, profile, updateProfile } = useAuth();
  const { items, promo, totals, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [fields, setFields] = useState<ShippingInfo>(() => initialFields(user?.username ?? "", profile));
  const [errors, setErrors] = useState<FieldErrors<ShippingInfo>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!confirmedOrder) return;
    const controller = new AbortController();
    getCatalogProducts(4, 0, controller.signal).then(setSuggestedProducts).catch(() => setSuggestedProducts([]));
    return () => controller.abort();
  }, [confirmedOrder]);

  if (!user) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  if (confirmedOrder) {
    return (
      <section className="mx-auto max-w-4xl py-10 sm:py-14">
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-8 sm:p-12">
          <p className="text-base font-medium uppercase tracking-wide text-emerald-800">Order #{confirmedOrder.number}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Thank you! Your order has been placed.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Order total: <span className="font-semibold text-slate-900">{formatPrice(confirmedOrder.total)}</span>. This is a local demo order; no payment was processed.
          </p>
          <section aria-labelledby="order-summary-heading" className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 text-left">
            <h2 id="order-summary-heading" className="text-xl font-semibold text-slate-900">Order summary</h2>
            <p className="mt-2 text-sm text-slate-600">
              Delivering to {confirmedOrder.shipping.fullName}, {confirmedOrder.shipping.address}, {confirmedOrder.shipping.city}, {confirmedOrder.shipping.country}.
            </p>
            <ul className="mt-5 space-y-3 border-b border-slate-200 pb-5">
              {confirmedOrder.items.map(({ product, quantity, options }) => (
                <li key={Cart.lineId({ product, options })} className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-600">
                    {product.title} × {quantity}
                    {options && <span className="block text-xs text-slate-500">{describeOptions(options)}</span>}
                  </span>
                  <span className="shrink-0 font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <OrderTotals subtotal={confirmedOrder.subtotal} discount={confirmedOrder.discount} shipping={confirmedOrder.shippingCost} total={confirmedOrder.total} promoCode={confirmedOrder.promoCode} size="sm" />
            </div>
          </section>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/orders/${confirmedOrder.id}`}
              state={{ justPlaced: true }}
              className="inline-flex min-h-14 items-center rounded-xl border border-violet-300 bg-white px-7 text-lg font-semibold text-violet-800 transition-colors hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              View order
            </Link>
            <Link
              to="/products"
              className="inline-flex min-h-14 items-center rounded-xl bg-violet-700 px-7 text-lg font-semibold text-white transition-colors hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
        {suggestedProducts.length > 0 && (
          <section className="mt-12 rounded-[1.5rem] bg-violet-50 p-5 text-left sm:p-8" aria-labelledby="checkout-recommendations">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Keep browsing</p>
            <h2 id="checkout-recommendations" className="mt-2 text-2xl font-semibold text-slate-900">You may also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-4">{suggestedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          </section>
        )}
      </section>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ notice: "Your cart is empty. Add products before checking out." }} />;
  }

  function updateField(field: keyof ShippingInfo, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validateShipping(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Disable "Place order" briefly so a double click cannot place two orders.
    setSubmitting(true);
    await wait(400);
    const order = placeOrder(new Cart(items, promo?.code ?? null), {
      ...fields,
      fullName: fields.fullName.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      address: fields.address.trim(),
      city: fields.city.trim(),
      postalCode: fields.postalCode.trim(),
    });
    updateProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      address: fields.address.trim(),
      city: fields.city.trim(),
      postalCode: fields.postalCode.trim(),
      country: fields.country,
      paymentMethod: fields.paymentMethod,
    });
    setConfirmedOrder(order);
    clearCart();
    setSubmitting(false);
  }

  const inputClass = (field: keyof ShippingInfo) =>
    `min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:opacity-60 ${errors[field] ? "border-amber-600" : "border-slate-300"}`;
  const describedBy = (field: keyof ShippingInfo) => (errors[field] ? `${field}-error` : undefined);

  const textFields: { id: keyof ShippingInfo; label: string; type?: string; autoComplete: string; inputMode?: "tel" | "numeric" }[] = [
    { id: "fullName", label: "Full name", autoComplete: "name" },
    { id: "email", label: "Email", type: "email", autoComplete: "email" },
    { id: "phone", label: "Phone", type: "tel", autoComplete: "tel", inputMode: "tel" },
    { id: "address", label: "Address", autoComplete: "street-address" },
    { id: "city", label: "City", autoComplete: "address-level2" },
    { id: "postalCode", label: "Postal code", autoComplete: "postal-code", inputMode: "numeric" },
  ];

  return (
    <section className="py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Complete your order</h1>
        <p className="mt-3 text-slate-600">Enter your delivery details to place this local demo order.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
          <fieldset className="grid gap-5 sm:grid-cols-2" disabled={submitting}>
            <legend className="mb-5 text-xl font-semibold text-slate-900">Delivery details</legend>
            {textFields.map(({ id, label, type = "text", autoComplete, inputMode }) => (
              <div key={id} className={id === "address" || id === "fullName" ? "sm:col-span-2" : ""}>
                <FormField id={id} label={label} error={errors[id]}>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    required
                    value={fields[id]}
                    aria-invalid={Boolean(errors[id])}
                    aria-describedby={describedBy(id)}
                    onChange={(event) => updateField(id, event.target.value)}
                    className={inputClass(id)}
                  />
                </FormField>
              </div>
            ))}
            <FormField id="country" label="Country" error={errors.country}>
              <select
                id="country"
                name="country"
                required
                value={fields.country}
                aria-invalid={Boolean(errors.country)}
                aria-describedby={describedBy("country")}
                onChange={(event) => updateField("country", event.target.value)}
                className={inputClass("country")}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
              </select>
            </FormField>
            <FormField id="paymentMethod" label="Payment method" error={errors.paymentMethod}>
              <select id="paymentMethod" name="paymentMethod" required value={fields.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)} className={inputClass("paymentMethod")}>
                <option value="card">Card (demo)</option>
                <option value="cash-on-delivery">Cash on delivery</option>
              </select>
            </FormField>
          </fieldset>
          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 font-semibold text-white transition-colors hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside aria-labelledby="checkout-summary" className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="checkout-summary" className="text-xl font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-5 space-y-3 border-b border-slate-200 pb-5">
            {items.map(({ product, quantity, options }) => (
              <li key={Cart.lineId({ product, options })} className="flex justify-between gap-4 text-sm">
                <span className="text-slate-600">
                  {product.title} × {quantity}
                  {options && <span className="block text-xs text-slate-500">{describeOptions(options)}</span>}
                </span>
                <span className="shrink-0 font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <OrderTotals {...totals} promoCode={promo?.code ?? null} size="sm" />
          </div>
          <Link to="/cart" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 underline focus-visible:outline-2 focus-visible:outline-violet-700">
            Edit cart
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
