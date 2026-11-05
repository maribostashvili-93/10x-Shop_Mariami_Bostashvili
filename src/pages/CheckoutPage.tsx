import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import ProductCard from "../components/products/ProductCard";
import { formatPrice, getCartTotals, getFinalPrice } from "../utils/formatPrice";

type CheckoutFields = {
  fullName: string;
  email: string;
  address: string;
  city: string;
};

type ConfirmedOrder = CheckoutFields & {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
};

type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;

const initialFields: CheckoutFields = {
  fullName: "",
  email: "",
  address: "",
  city: "",
};

function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(() => {
    try { return { ...initialFields, ...JSON.parse(localStorage.getItem("10x-profile") ?? "{}")} as CheckoutFields; } catch { return initialFields; }
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(true).then((products) => setSuggestedProducts(products.slice(0, 4))).catch(() => setSuggestedProducts([]));
  }, []);

  if (!user) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  if (confirmedOrder) {
    return (
      <section className="mx-auto max-w-4xl py-10 sm:py-14">
        <div className="rounded-[1.5rem] border border-violet-200 bg-violet-50/80 p-8 sm:p-12">
          <p className="text-base font-medium uppercase tracking-wide text-violet-800">Order confirmed</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Thank you for your order</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Your order has been placed locally for this demo. No real payment was processed.
          </p>
          <section aria-labelledby="order-summary-heading" className="mt-8 rounded-2xl border border-violet-100 bg-white p-6 text-left">
            <h2 id="order-summary-heading" className="text-xl font-semibold text-slate-900">Order summary</h2>
            <p className="mt-2 text-sm text-slate-600">
              Delivering to {confirmedOrder.fullName}, {confirmedOrder.address}, {confirmedOrder.city}. Confirmation sent to {confirmedOrder.email}.
            </p>
            <ul className="mt-5 space-y-3 border-b border-slate-200 pb-5">
              {confirmedOrder.items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-600">{product.title} × {quantity}</span>
                  <span className="shrink-0 font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-600">Subtotal</dt><dd className="font-semibold text-slate-900">{formatPrice(confirmedOrder.subtotal)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-600">Discount</dt><dd className="font-semibold text-violet-700">−{formatPrice(confirmedOrder.discount)}</dd></div>
              <div className="flex justify-between gap-4 pt-2 text-lg font-semibold text-slate-900"><dt>Total</dt><dd>{formatPrice(confirmedOrder.total)}</dd></div>
            </dl>
          </section>
          <Link
            to="/products"
            className="mt-8 inline-flex min-h-14 items-center rounded-xl bg-violet-700 px-7 text-lg font-semibold text-white transition-colors hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            Continue shopping
          </Link>
        </div>
        {suggestedProducts.length > 0 && <section className="mt-12 rounded-[1.5rem] bg-[#f4efff] p-5 text-left sm:p-8" aria-labelledby="checkout-recommendations">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Keep browsing</p>
          <h2 id="checkout-recommendations" className="mt-2 text-2xl font-semibold text-slate-900">You may also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-4">{suggestedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>}
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add a product before continuing to checkout.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-red-900 px-5 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
        >
          Browse products
        </Link>
      </section>
    );
  }

  const { subtotal, discount, total } = getCartTotals(items);

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): CheckoutErrors {
    const nextErrors: CheckoutErrors = {};
    if (!fields.fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!fields.email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(fields.email)) nextErrors.email = "Enter a valid email address.";
    if (!fields.address.trim()) nextErrors.address = "Enter your delivery address.";
    if (!fields.city.trim()) nextErrors.city = "Enter your city.";
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // Snapshot the order before clearing the cart so the confirmation can show it.
    setConfirmedOrder({ ...fields, items, subtotal, discount, total });
    clearCart();
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-900">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Complete your order</h1>
        <p className="mt-3 text-slate-600">Enter your details to place this local demo order.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
          <fieldset className="space-y-5">
            <legend className="text-xl font-semibold text-slate-900">Delivery details</legend>
            <Field label="Full name" id="fullName" value={fields.fullName} error={errors.fullName} onChange={(value) => updateField("fullName", value)} />
            <Field label="Email" id="email" type="email" value={fields.email} error={errors.email} onChange={(value) => updateField("email", value)} />
            <Field label="Address" id="address" value={fields.address} error={errors.address} onChange={(value) => updateField("address", value)} />
            <Field label="City" id="city" value={fields.city} error={errors.city} onChange={(value) => updateField("city", value)} />
          </fieldset>
          <button type="submit" className="mt-8 min-h-11 w-full rounded-lg bg-red-900 px-4 font-semibold text-white transition-colors hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900">
            Place order
          </button>
        </form>

        <aside aria-labelledby="checkout-summary" className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="checkout-summary" className="text-xl font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-5 space-y-3 border-b border-slate-200 pb-5">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-4 text-sm">
                <span className="text-slate-600">{product.title} × {quantity}</span>
                <span className="shrink-0 font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-600">Subtotal</dt><dd className="font-semibold text-slate-900">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-600">Discount</dt><dd className="font-semibold text-violet-700">−{formatPrice(discount)}</dd></div>
            <div className="flex justify-between gap-4 pt-2 text-lg font-semibold text-slate-900"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <Link to="/cart" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-red-900 underline focus-visible:outline-2 focus-visible:outline-red-900">
            Edit cart
          </Link>
        </aside>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  id: keyof CheckoutFields;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function Field({ label, id, type = "text", value, error, onChange }: FieldProps) {
  const inputClass = `min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${error ? "border-red-700" : "border-slate-300"}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-900">{label}<span aria-hidden="true"> *</span></label>
      <input id={id} name={id} type={type} value={value} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-800">{error}</p>}
    </div>
  );
}

export default CheckoutPage;
