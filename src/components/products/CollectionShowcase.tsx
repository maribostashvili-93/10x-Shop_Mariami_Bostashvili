import { useEffect, useState } from "react";
import { Link } from "react-router";
import CollectionBanner from "./CollectionBanner";
import type { Product } from "../../types/product";
import { getProductsByCategory } from "../../api/products";
import { formatPrice, getFinalPrice } from "../../utils/formatPrice";

const SHOWCASE_CATEGORIES = ["fragrances", "womens-bags", "womens-watches", "womens-jewellery"];

export default function CollectionShowcase() {
  // null while loading, so the section can keep its final size and nothing below it jumps.
  const [selected, setSelected] = useState<Product[] | null>(null);

  // One product per category (4 small requests) instead of downloading the whole catalog.
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(SHOWCASE_CATEGORIES.map((category) => getProductsByCategory(category, 1, controller.signal)))
      .then((lists) => setSelected(lists.flat()))
      .catch(() => { if (!controller.signal.aborted) setSelected([]); });
    return () => controller.abort();
  }, []);

  if (selected && selected.length === 0) return null;
  return (
    <section aria-labelledby="signature-edit-heading" className="mb-10 space-y-5">
      <div className="grid gap-5 rounded-3xl border border-violet-100 bg-white p-5 sm:p-6 xl:grid-cols-[190px_minmax(0,1fr)]">
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-violet-700 uppercase">The signature edit</p>
          <h2 id="signature-edit-heading" className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900">Little details.<br />Lasting impressions.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Discover fragrances, timeless accessories and thoughtful everyday pieces.</p>
          <Link to="/products" className="mt-5 inline-flex min-h-11 w-fit items-center gap-3 rounded-xl bg-violet-700 px-4 text-xs font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">Explore the collection <span aria-hidden="true">→</span></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {!selected && Array.from({ length: 4 }, (_, index) => (
            <div key={index} aria-hidden="true" className="min-w-0">
              <div className="aspect-[4/5] animate-pulse rounded-xl bg-violet-50/70" />
              <div className="mt-3 h-3 w-2/3 rounded bg-violet-50" />
              <div className="mt-2 h-10 rounded bg-violet-50" />
              <div className="mt-2 h-9 w-1/2 rounded bg-violet-50" />
            </div>
          ))}
          {selected?.map((product) => <article key={product.id} className="min-w-0">
            <Link to={`/products/${product.id}`} className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-violet-50/70 p-3"><img src={product.thumbnail} alt={product.title} width={240} height={300} loading="lazy" className="h-full w-full object-contain transition-transform motion-safe:group-hover:scale-105" /></div>
              <p className="mt-3 text-[10px] font-medium tracking-wide text-violet-700 uppercase">{product.category.replaceAll("-", " ")}</p>
              <h3 className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-slate-900">{product.title}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatPrice(getFinalPrice(product))}</p>
              <p className="mt-1 text-[10px] text-slate-500">Rated {product.rating.toFixed(1)} / 5</p>
            </Link>
          </article>)}
        </div>
      </div>
      <CollectionBanner />
    </section>
  );
}
