import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { getCategories } from "../../api/products";
import type { Category } from "../../types/product";

export default function ShopSearch() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const featured = params.get("collection") === "featured";
  useEffect(() => {
    let active = true;
    getCategories().then((data) => { if (active) setCategories(data); })
      .catch(() => { if (active) setCategoryError(true); });
    return () => { active = false; };
  }, []);
  function destination(nextCategory: string) {
    const next = new URLSearchParams();
    if (featured) next.set("collection", "featured");
    if (query) next.set("q", query);
    if (nextCategory) next.set("category", nextCategory);
    if (sort) next.set("sort", sort);
    return `/products${next.size ? `?${next}` : ""}`;
  }
  return (
    <section aria-label="Search and filter products" className="mb-5 space-y-2">
      <div className="flex gap-2">
        <form key={`${pathname}:${query}`} role="search" onSubmit={(event) => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
          const next = new URLSearchParams();
          if (featured) next.set("collection", "featured");
          if (value) next.set("q", value);
          if (category) next.set("category", category);
          if (sort) next.set("sort", sort);
          navigate(`/products${next.size ? `?${next}` : ""}`);
        }} className="flex min-w-0 flex-1 items-center rounded-2xl border border-stone-200 bg-white pl-3">
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <input id="shop-search" name="q" type="search" defaultValue={query} placeholder="Search products…" className="min-h-11 min-w-0 flex-1 rounded-xl bg-transparent px-1 text-base text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-red-900" />
          <button type="submit" aria-label="Search products" className="flex size-11 shrink-0 items-center justify-center rounded-xl text-red-900 focus-visible:outline-2 focus-visible:outline-red-900"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg></button>
        </form>
        <button type="button" aria-label="Product filters" aria-expanded={expanded} aria-controls="shop-filters" onClick={() => setExpanded((value) => !value)} className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border focus-visible:outline-2 focus-visible:outline-red-900 ${expanded ? "border-red-900 bg-red-900 text-white" : "border-stone-200 bg-white text-red-900"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5"><path d="M3 7h18M3 17h18"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="17" r="2" fill="currentColor"/></svg></button>
      </div>
      <nav aria-label="Product collections and categories" className="flex min-w-0 snap-x snap-proximity items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] motion-safe:scroll-smooth">
        {[{ value: "", label: "All products" }, { value: "featured", label: "Featured products" }].map(({ value, label }) => {
          const next = new URLSearchParams(params);
          if (value) next.set("collection", value); else next.delete("collection");
          next.delete("category");
          const selected = value === (featured ? "featured" : "") && !category;
          return <Link key={value} to={`/products${next.size ? `?${next}` : ""}`} aria-current={selected ? "true" : undefined} className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full px-0.5 focus-visible:outline-2 focus-visible:outline-red-900"><span className={`rounded-full px-3 py-2 text-xs font-medium ${selected ? "bg-red-900 text-white" : "text-stone-600"}`}>{label}</span></Link>;
        })}
        <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-stone-200" />
        {categories.map((item) => <Link key={item.slug} to={destination(item.slug)} aria-current={category === item.slug ? "true" : undefined} className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full px-0.5 focus-visible:outline-2 focus-visible:outline-red-900"><span className={`rounded-full px-3 py-2 text-xs font-medium ${category === item.slug ? "bg-red-900 text-white" : "text-stone-600"}`}>{item.name}</span></Link>)}
      </nav>
      {categoryError && <p role="status" className="text-xs text-stone-600">Categories are unavailable. Product search is still available.</p>}
      {expanded && <div id="shop-filters" className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-700">Category<select value={category} onChange={(event) => navigate(destination(event.target.value))} className="mt-1 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-base focus-visible:outline-red-900"><option value="">All categories</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
        <label className="text-sm font-medium text-stone-700">Sort by<select value={sort} onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value) next.set("sort", event.target.value); else next.delete("sort"); navigate(`/products?${next}`); }} className="mt-1 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-base focus-visible:outline-red-900"><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></label>
      </div>}
    </section>
  );
}
