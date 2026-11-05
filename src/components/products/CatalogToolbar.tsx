import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/products";
import type { Category } from "../../types/product";
import { useDebounce } from "../../hooks/useDebounce";
import { SORT_OPTIONS, type CatalogParams } from "../../utils/url";

type CatalogToolbarProps = {
  params: CatalogParams;
  /** Called with the changed filters; the page goes back to 1. */
  onChange: (changes: Partial<CatalogParams>) => void;
};

const control = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

function CatalogToolbar({ params, onChange }: CatalogToolbarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(params.q);
  const [syncedQuery, setSyncedQuery] = useState(params.q);
  const debouncedQuery = useDebounce(query, 400);

  // The input updates immediately; the URL only after typing pauses for 400 ms.
  // If the URL changes from outside (Back/Forward, Clear filters), show that value.
  if (params.q !== syncedQuery) {
    setSyncedQuery(params.q);
    setQuery(params.q);
  }

  useEffect(() => {
    if (debouncedQuery !== query || debouncedQuery.trim() === params.q) return;
    onChange({ q: debouncedQuery.trim(), category: "" });
    // Only typing should trigger this; reacting to params would undo Back/Forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    const controller = new AbortController();
    getAllCategories(controller.signal).then(setCategories).catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  return (
    <div role="search" className="grid gap-3 rounded-2xl border border-violet-100 bg-white p-4 sm:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <label htmlFor="catalog-search" className="mb-1 block text-xs font-semibold text-slate-600">Search</label>
        <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className={control} />
      </div>
      <div>
        <label htmlFor="catalog-category" className="mb-1 block text-xs font-semibold text-slate-600">Category</label>
        <select
          id="catalog-category"
          value={params.category}
          onChange={(event) => { setQuery(""); onChange({ category: event.target.value, q: "" }); }}
          className={control}
        >
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="catalog-sort" className="mb-1 block text-xs font-semibold text-slate-600">Sort by</label>
        <select id="catalog-sort" value={params.sort} onChange={(event) => onChange({ sort: SORT_OPTIONS.find((option) => option.value === event.target.value)?.value ?? "" })} className={control}>
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    </div>
  );
}

export default CatalogToolbar;
