import { Link } from "react-router";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 sm:p-12">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-4 text-xl font-medium text-red-900">Coming soon</p>
      <p className="mt-3 text-slate-600">This feature is not available yet.</p>
      <Link to="/products" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-red-900 px-5 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900">Browse products</Link>
    </section>
  );
}
