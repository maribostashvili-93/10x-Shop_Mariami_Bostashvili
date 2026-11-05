import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { fetchCatalog } from "../api/products";
import type { AsyncState } from "../types/api";
import type { ProductsResponse } from "../types/product";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/products/Pagination";
import CatalogToolbar from "../components/products/CatalogToolbar";
import HeroCarousel from "../components/products/HeroCarousel";
import JournalCards from "../components/products/JournalCards";
import { PAGE_SIZE, buildCatalogUrl, parseCatalogParams, type CatalogParams } from "../utils/url";

const gridClass = "grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

/**
 * Catalog (/). The URL is the single source of truth: q, category, sort and page
 * are read from it, turned into one API request, and rendered. Refresh,
 * Back/Forward and shared links therefore restore the same results.
 */
function CatalogPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = parseCatalogParams(searchParams);
  const requestKey = buildCatalogUrl(params);
  const [state, setState] = useState<AsyncState<ProductsResponse>>({ status: "loading" });
  const [loadedKey, setLoadedKey] = useState(requestKey);
  const [reloadCount, setReloadCount] = useState(0);

  // Show the loading state as soon as the filters change (set during render, not in an effect).
  if (loadedKey !== requestKey) {
    setLoadedKey(requestKey);
    setState({ status: "loading" });
  }

  useEffect(() => {
    // Cancel the previous request when the filters change before it finishes,
    // so an old response can never overwrite newer results.
    const controller = new AbortController();
    fetchCatalog(parseCatalogParams(new URLSearchParams(requestKey.slice(2))), controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState({ status: "error", message: "Could not load products. Please try again." });
      });
    return () => controller.abort();
  }, [requestKey, reloadCount]);

  function update(changes: Partial<CatalogParams>) {
    // Any filter change starts again from page 1.
    navigate(buildCatalogUrl({ ...params, ...changes, page: 1 }));
  }

  function goToPage(page: number) {
    navigate(buildCatalogUrl({ ...params, page }));
  }

  function retry() {
    setState({ status: "loading" });
    setReloadCount((count) => count + 1);
  }

  const hasFilters = Boolean(params.q || params.category || params.sort);
  const data = state.status === "success" ? state.data : null;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const firstShown = data && data.products.length > 0 ? data.skip + 1 : 0;
  const lastShown = data ? data.skip + data.products.length : 0;

  return (
    <div>
      {!hasFilters && params.page === 1 && <HeroCarousel />}

      <section aria-labelledby="catalog-heading" className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h1 id="catalog-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">Catalog</h1>
          <p aria-live="polite" className="text-sm text-slate-600">
            {data ? `${data.total} ${data.total === 1 ? "product" : "products"}${params.q ? ` for “${params.q}”` : ""}` : "Loading products..."}
          </p>
        </div>

        <CatalogToolbar params={params} onChange={update} />

        {state.status === "loading" && (
          <div role="status" aria-label="Loading products" className={`mt-6 ${gridClass}`}>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-violet-50" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-900">{state.message}</p>
            <button type="button" onClick={retry} className="mt-4 min-h-11 rounded-lg bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
              Retry
            </button>
          </div>
        )}

        {data && data.products.length === 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6">
            <p className="font-semibold text-slate-900">No products found.</p>
            <Link to="/" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">Clear filters</Link>
          </div>
        )}

        {data && data.products.length > 0 && (
          <>
            <ProductGrid products={data.products} className="mt-6" />
            <p className="mt-6 text-center text-sm text-slate-600">Showing {firstShown}–{lastShown} of {data.total}</p>
            <Pagination page={params.page} totalPages={totalPages} onChange={goToPage} />
          </>
        )}
      </section>

      {!hasFilters && params.page === 1 && <JournalCards />}
    </div>
  );
}

export default CatalogPage;
