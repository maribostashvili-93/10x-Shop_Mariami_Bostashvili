import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/products/Pagination";
import { filterAndSortProducts, paginate } from "../utils/catalog";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; products: Product[] };

export default function ProductsPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const price = params.get("price") ?? "";
  const requestedPage = Number(params.get("page") ?? "1");
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // AbortController cancels the request if the page unmounts or the user retries.
    const controller = new AbortController();
    getProducts(true, controller.signal)
      .then((products) => setState({ status: "success", products }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState({ status: "error" });
      });
    return () => controller.abort();
  }, [reloadKey]);

  // Filtering 100+ products on every render is cheap, but memoising keeps typing in search smooth.
  const filtered = useMemo(
    () => filterAndSortProducts(state.status === "success" ? state.products : [], { query, category, price, sort }),
    [state, query, category, price, sort],
  );
  const { page, totalPages, skip, pageItems } = paginate(filtered, requestedPage);

  function retry() {
    setState({ status: "loading" });
    setReloadKey((key) => key + 1);
  }

  return (
    <section>
      <h1 className="text-xl font-semibold text-slate-900 sm:text-3xl">Shop</h1>
      <p aria-live="polite" className="mt-2 text-sm text-slate-600">
        {state.status !== "success"
          ? "Explore our product collection."
          : filtered.length === 0
            ? "0 products"
            : `Showing ${skip + 1}–${skip + pageItems.length} of ${filtered.length} products${category ? ` in ${category.replaceAll("-", " ")}` : ""}${query ? ` matching “${query}”` : ""}`}
      </p>

      {state.status === "loading" && (
        <div role="status" aria-label="Loading products" className="mt-4 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-brand-50" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-900">Could not load products. Please try again.</p>
          <button type="button" onClick={retry} className="mt-4 min-h-11 rounded-lg bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Try again
          </button>
        </div>
      )}

      {state.status === "success" && (filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-5">
          <p>No products match your search and filters.</p>
          <Link to="/products" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">Clear filters</Link>
        </div>
      ) : (
        <>
          <ProductGrid products={pageItems} className="mt-4" />
          <Pagination page={page} totalPages={totalPages} />
        </>
      ))}
    </section>
  );
}
