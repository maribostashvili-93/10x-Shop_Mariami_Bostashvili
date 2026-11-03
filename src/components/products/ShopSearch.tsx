import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { getCategories } from "../../api/products";
import type { Category } from "../../types/product";

export default function ShopSearch({ showCategories = true }: { showCategories?: boolean }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    getCategories().then((data) => { if (active) setCategories(data); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  const control = "h-8 w-full min-w-0 rounded-lg bg-transparent px-0 text-xs font-semibold leading-4 text-slate-800 focus-visible:outline-none focus-visible:ring-0";
  return (
    <section aria-label="Search and filter products" className="mb-7 space-y-3">
      <form key={params.toString()} role="search" onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const next = new URLSearchParams(params);
        for (const name of ["q", "category", "price"]) {
          const value = String(data.get(name) ?? "").trim();
          if (value) next.set(name, value); else next.delete(name);
        }
        navigate(`/products${next.size ? `?${next}` : ""}`);
      }} className="relative z-10 grid w-full min-w-0 max-w-full grid-cols-1 items-stretch gap-1 overflow-visible rounded-[2rem] border border-violet-100 bg-white p-2 shadow-[0_8px_30px_rgba(91,33,182,0.08)] lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(120px,auto)] xl:items-center xl:gap-0.5 xl:rounded-full xl:p-1">
        {[
          { name: "q", label: "Find your next favorite", path: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" },
          { name: "category", label: "Category", path: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
          { name: "price", label: "Price range", path: "M20 12 12 20 4 12V4h8l8 8ZM8 8h.01" },
        ].map(({ name, label, path }) => <label key={name} className="flex h-[56px] min-w-0 items-center gap-2 rounded-2xl px-2 py-1 xl:border-r xl:border-violet-100">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0"><path d={path} /></svg></span>
          <span className="flex min-w-0 flex-1 flex-col justify-center"><span className="block text-[10px] font-medium leading-4 text-slate-500">{label}</span>
          {name === "q" ? <input name="q" type="search" defaultValue={params.get("q") ?? ""} placeholder="Search products" className={control} /> : name === "category" ? <div className="relative"><input type="hidden" name="category" value={params.get("category") ?? ""} /><button type="button" aria-haspopup="listbox" aria-expanded={categoryOpen} onClick={() => setCategoryOpen((open) => !open)} className={`${control} flex items-center justify-between text-left`}><span>{categories.find((item) => item.slug === params.get("category"))?.name ?? "All categories"}</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0"><path d="m6 9 6 6 6-6" /></svg></button>{categoryOpen && <div role="listbox" className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full min-w-52 overflow-auto rounded-xl border border-violet-100 bg-white p-1 shadow-xl">{[{ slug: "", name: "All categories" }, ...categories].map((item) => <button key={item.slug || "all"} type="button" onClick={() => { const next = new URLSearchParams(params); if (item.slug) { next.set("category", item.slug); } else { next.delete("category"); } navigate(`/products${next.size ? `?${next}` : ""}`); setCategoryOpen(false); }} className="block min-h-10 w-full rounded-lg px-3 text-left text-sm text-slate-800 hover:bg-violet-50 hover:text-violet-800">{item.name}</button>)}</div>}</div> : <select name={name} defaultValue={params.get(name) ?? ""} className={control}>
          <option value="">Any price</option><option value="under-50">Under $50</option><option value="50-100">$50 - $100</option><option value="over-100">Over $100</option>
          </select>}</span>
        </label>)}
        <button type="submit" className="m-0 flex min-h-10 min-w-0 w-full items-center justify-center gap-1.5 self-center rounded-[1.4rem] bg-violet-700 px-3 text-xs font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 xl:min-h-10 xl:px-3 xl:mr-2"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><span>Search</span></button>
      </form>
      {error && <p role="status" className="text-xs text-slate-600">Categories could not load. Search and price filters are available.</p>}
      {showCategories && <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <Link to="/products" className="inline-flex min-h-11 items-center text-xs font-semibold text-violet-700">Clear filters</Link>
        <label className="flex items-center gap-2 text-xs text-slate-500">Sort by<select value={params.get("sort") ?? ""} onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value) next.set("sort", event.target.value); else next.delete("sort"); navigate(`/products?${next}`); }} className="min-h-11 rounded-xl border border-violet-100 bg-white px-3 text-sm text-slate-800 focus-visible:outline-violet-700"><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></label>
      </div>}
    </section>
  );
}
