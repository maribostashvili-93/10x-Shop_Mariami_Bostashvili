import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CATALOG_PAGE_SIZE, getCatalogProducts } from "../../api/products";
import type { Product } from "../../types/product";
import ProductGrid from "./ProductGrid";

type CatalogState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; products: Product[] };

/** CORE catalog: GET /products?limit=12&skip=0 rendered with ProductGrid → ProductCard. */
function CatalogSection() {
  const [state, setState] = useState<CatalogState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getCatalogProducts(CATALOG_PAGE_SIZE, 0, controller.signal)
      .then((products) => setState({ status: "success", products }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState({ status: "error", message: "Could not load products. Please try again." });
      });

    return () => controller.abort();
  }, [reloadKey]);

  function retry() {
    setState({ status: "loading" });
    setReloadKey((key) => key + 1);
  }

  return (
    <section className="mt-10" aria-labelledby="catalog-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-violet-700 uppercase">Catalog</p>
          <h2 id="catalog-heading" className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">All products</h2>
        </div>
        <Link to="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-950">
          Browse the shop <span aria-hidden="true" className="ml-1">→</span>
        </Link>
      </div>

      {state.status === "loading" && (
        <div role="status" aria-label="Loading products" className="mt-4 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-violet-50" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-900">{state.message}</p>
          <button type="button" onClick={retry} className="mt-4 min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
            Try again
          </button>
        </div>
      )}

      {state.status === "success" &&
        (state.products.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-white p-6 text-slate-600">No products are available right now.</p>
        ) : (
          <ProductGrid products={state.products} className="mt-4" />
        ))}
    </section>
  );
}

export default CatalogSection;
