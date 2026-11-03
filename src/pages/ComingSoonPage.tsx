import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ComingSoonPage({ title }: { title: string }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const isOrders = title === "My Orders";
  const isCoupons = title === "Coupons";
  const isSettings = title === "Account Settings";
  return (
    <section className="rounded-2xl border border-violet-100 bg-white px-6 py-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Your account</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
      {isOrders && <div className="mt-8 rounded-xl bg-violet-50 p-6"><p className="font-semibold text-slate-900">No orders yet</p><p className="mt-2 text-sm text-slate-600">Your completed orders will appear here.</p><Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800">Start shopping</Link></div>}
      {isCoupons && <div className="mt-8 grid gap-4 sm:grid-cols-2"><article className="rounded-xl border border-violet-200 bg-violet-50 p-5"><p className="text-2xl font-bold text-violet-800">WELCOME10</p><p className="mt-2 text-sm text-slate-600">10% off your next order</p><button type="button" onClick={() => setSaved(true)} className="mt-4 min-h-10 rounded-lg bg-violet-700 px-4 text-sm font-semibold text-white">{saved ? "Copied" : "Save coupon"}</button></article><article className="rounded-xl border border-slate-200 p-5"><p className="text-2xl font-bold text-slate-900">FREESHIP</p><p className="mt-2 text-sm text-slate-600">Free shipping on eligible orders</p><button type="button" onClick={() => setSaved(true)} className="mt-4 min-h-10 rounded-lg border border-violet-200 px-4 text-sm font-semibold text-violet-700">{saved ? "Saved" : "Save coupon"}</button></article></div>}
      {isSettings && <form className="mt-8 max-w-xl space-y-5" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); localStorage.setItem("10x-profile", JSON.stringify({ fullName: data.get("fullName"), email: data.get("email"), address: data.get("address"), city: data.get("city") })); setSaved(true); }}><label className="block text-sm font-medium text-slate-900">Profile photo<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => localStorage.setItem("10x-profile-photo", String(reader.result)); reader.readAsDataURL(file); }} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-slate-900">Username<input name="fullName" defaultValue={user?.username ?? ""} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3" /></label><label className="block text-sm font-medium text-slate-900">Email<input name="email" type="email" defaultValue={`${user?.username ?? "customer"}@example.com`} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3" /></label><label className="block text-sm font-medium text-slate-900">Delivery address<input name="address" defaultValue={JSON.parse(localStorage.getItem("10x-profile") ?? "{}").address ?? ""} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3" /></label><label className="block text-sm font-medium text-slate-900">City<input name="city" defaultValue={JSON.parse(localStorage.getItem("10x-profile") ?? "{}").city ?? ""} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3" /></label><button type="submit" className="min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white">{saved ? "Saved" : "Save changes"}</button></form>}
      {!isOrders && !isCoupons && !isSettings && <><p className="mt-4 text-slate-600">Manage your account information and preferences here.</p><Link to="/products" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-5 font-semibold text-white">Browse products</Link></>}
    </section>
  );
}
