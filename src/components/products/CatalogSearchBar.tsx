import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { getAllCategories } from "../../api/products";
import type { Category } from "../../types/product";
import { useDebounce } from "../../hooks/useDebounce";
import { SORT_OPTIONS, buildCatalogUrl, type CatalogParams } from "../../utils/url";

type CatalogSearchBarProps = {
  params: Pick<CatalogParams, "q" | "category" | "sort">;
  /**
   * On the catalog page the results update while choosing (search after a 400 ms pause).
   * On the home page nothing changes until "Search" opens the catalog.
   */
  live?: boolean;
};

const control = "h-8 w-full min-w-0 rounded-lg bg-transparent px-0 text-xs font-semibold leading-4 text-slate-800 focus-visible:outline-none focus-visible:ring-0";
const selectControl = `${control} appearance-none pr-6`;

function Field({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <label className="flex h-[56px] min-w-0 items-center gap-2 rounded-2xl px-2 py-1 focus-within:bg-violet-50/60 xl:border-r xl:border-violet-100">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0"><path d={icon} /></svg>
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col justify-center">
        <span className="block text-[10px] font-medium leading-4 text-slate-600">{label}</span>
        {children}
      </span>
    </label>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute right-0 bottom-2 size-4 text-slate-700">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CatalogSearchBar({ params, live = false }: CatalogSearchBarProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(params.q);
  const [category, setCategory] = useState(params.category);
  const [sort, setSort] = useState(params.sort);
  const [synced, setSynced] = useState(params);
  const debouncedQuery = useDebounce(query, 400);

  // Show the URL's values again after Back/Forward or "Clear filters".
  if (synced.q !== params.q || synced.category !== params.category || synced.sort !== params.sort) {
    setSynced(params);
    setQuery(params.q);
    setCategory(params.category);
    setSort(params.sort);
  }

  useEffect(() => {
    const controller = new AbortController();
    getAllCategories(controller.signal).then(setCategories).catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  // Live search on the catalog page: update ?q= about 400 ms after typing stops.
  useEffect(() => {
    if (!live || debouncedQuery !== query || debouncedQuery.trim() === params.q) return;
    navigate(buildCatalogUrl({ q: debouncedQuery.trim(), sort: params.sort, page: 1 }), { replace: Boolean(params.q) });
    // Only typing should trigger this; reacting to params would undo Back/Forward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function go(next: Partial<CatalogParams>) {
    // Search and category cannot be combined in the API; any change returns to page 1.
    navigate(buildCatalogUrl({ q: query.trim(), category, sort, ...next, page: 1 }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go({ q: query.trim(), category: query.trim() ? "" : category });
  }

  return (
    <section aria-label="Search and filter products" className="mb-7">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="relative z-10 grid w-full min-w-0 max-w-full grid-cols-1 items-stretch gap-1 overflow-visible rounded-[2rem] border border-violet-100 bg-white p-2 shadow-[0_8px_30px_rgba(91,33,182,0.08)] lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(120px,auto)] xl:items-center xl:gap-0.5 xl:rounded-full xl:p-1"
      >
        <Field icon="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0" label="Find your next favorite">
          <input name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className={control} />
        </Field>
        <Field icon="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" label="Category">
          <select
            name="category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              if (live) { setQuery(""); go({ category: event.target.value, q: "" }); }
            }}
            className={selectControl}
          >
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <Chevron />
        </Field>
        <Field icon="M3 6h18M6 12h12M10 18h4" label="Sort by">
          <select
            name="sort"
            value={sort}
            onChange={(event) => {
              const next = SORT_OPTIONS.find((option) => option.value === event.target.value)?.value ?? "";
              setSort(next);
              if (live) go({ sort: next });
            }}
            className={selectControl}
          >
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <Chevron />
        </Field>
        <button type="submit" className="m-0 flex min-h-10 min-w-0 w-full items-center justify-center gap-1.5 self-center rounded-[1.4rem] bg-violet-700 px-3 text-xs font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 xl:min-h-10 xl:px-3 xl:mr-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
          <span>Search</span>
        </button>
      </form>
    </section>
  );
}

export default CatalogSearchBar;
