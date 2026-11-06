import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { fetchCatalog } from "../api/products";
import type { AsyncState } from "../types/api";
import type { ProductsResponse } from "../types/product";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/products/Pagination";
import CatalogSearchBar from "../components/products/CatalogSearchBar";
import { DEALS_MIN_DISCOUNT, PAGE_SIZE, buildCatalogUrl, parseCatalogParams, rememberCatalogUrl } from "../utils/url";

const gridClass = "grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

/**
 * Full catalog (/products). The URL is the single source of truth: q, category,
 * sort and page are read from it, turned into one API request, and rendered.
 * Refresh, Back/Forward and shared links therefore restore the same results.
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

  // "Back to catalog" on a product page returns to this exact view.
  useEffect(() => {
    rememberCatalogUrl(requestKey);
  }, [requestKey]);

  useEffect(() => {
    // Cancel the previous request when the filters change before it finishes,
    // so an old response can never overwrite newer results.
    const controller = new AbortController();
    const query = requestKey.split("?")[1] ?? "";
    fetchCatalog(parseCatalogParams(new URLSearchParams(query)), controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState({ status: "error", message: "Could not load products. Please try again." });
      });
    return () => controller.abort();
  }, [requestKey, reloadCount]);

  function goToPage(page: number) {
    navigate(buildCatalogUrl({ ...params, page }));
  }

  function retry() {
    setState({ status: "loading" });
    setReloadCount((count) => count + 1);
  }

  const data = state.status === "success" ? state.data : null;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const firstShown = data && data.products.length > 0 ? data.skip + 1 : 0;
  const lastShown = data ? data.skip + data.products.length : 0;

  return (
    <section aria-labelledby="catalog-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h1 id="catalog-heading" className="text-2xl font-semibold text-slate-900 sm:text-3xl">Catalog</h1>
        <p aria-live="polite" className="text-sm text-slate-600">
          {data
            ? `${data.total} ${data.total === 1 ? "product" : "products"}${params.deals ? ` with ${DEALS_MIN_DISCOUNT}% off or more` : params.q ? ` for “${params.q}”` : ""}`
            : "Loading products..."}
        </p>
      </div>

      <CatalogSearchBar params={params} live />

      {/* Every product keeps its own discount badge; Best deals only lists the biggest ones. */}
      <nav aria-label="Catalog views" className="-mt-3 mb-6 flex flex-wrap gap-2">
        {[
          { to: "/products", label: "All products", active: !params.deals },
          { to: buildCatalogUrl({ deals: true }), label: `Best deals · ${DEALS_MIN_DISCOUNT}%+ off`, active: params.deals },
        ].map((view) => (
          <Link
            key={view.label}
            to={view.to}
            aria-current={view.active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${view.active ? "border-violet-700 bg-violet-700 text-white" : "border-violet-200 bg-white text-violet-800 hover:bg-violet-50"}`}
          >
            {view.label}
          </Link>
        ))}
      </nav>

      {state.status === "loading" && (
        <div role="status" aria-label="Loading products" className={gridClass}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-violet-50" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-900">{state.message}</p>
          <button type="button" onClick={retry} className="mt-4 min-h-11 rounded-lg bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Retry
          </button>
        </div>
      )}

      {data && data.products.length === 0 && (
        <div className="rounded-2xl bg-white p-6">
          <p className="font-semibold text-slate-900">No products found.</p>
          <Link to="/products" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">Clear filters</Link>
        </div>
      )}

      {data && data.products.length > 0 && (
        <>
          <ProductGrid products={data.products} />
          <p className="mt-6 text-center text-sm text-slate-600">Showing {firstShown}–{lastShown} of {data.total}</p>
          <Pagination page={params.page} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </section>
  );
}

export default CatalogPage;
