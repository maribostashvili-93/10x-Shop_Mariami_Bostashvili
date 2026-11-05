import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Category, Product } from "../../types/product";
import { getCategories, getSortedProducts } from "../../api/products";
import { CategoryIcon } from "./CategoryIcon";
import ProductCard from "./ProductCard";

const FEATURES = [
  ["Delivery", "Browse everyday essentials", "M3 6h11v11H3zM14 10h4l3 3v4h-7M6 20h1M17 20h1"],
  ["Wishlist", "Keep your favorite finds", "M12 21 3 12a5 5 0 0 1 9-7 5 5 0 0 1 9 7Z"],
  ["Easy shopping", "Clear prices and details", "m5 12 4 4L19 6"],
  ["Curated picks", "Find your next favorite", "m12 3 3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1Z"],
] as const;

export function FeatureStrip() {
  return (
    <div className="relative mx-3 -mt-3 grid grid-cols-2 gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:mx-6 sm:grid-cols-4">
      {FEATURES.map(([title, text, path]) => (
        <div key={title} className="flex items-center gap-3">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7 shrink-0 text-violet-700"><path d={path} /></svg>
          <div><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-[10px] text-slate-600">{text}</p></div>
        </div>
      ))}
    </div>
  );
}

export function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <section className="mt-10" aria-labelledby="shop-categories-heading">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-violet-700 uppercase">Discover the edit</p>
          <h2 id="shop-categories-heading" className="mt-1 text-xl font-bold text-stone-900 sm:text-2xl">Shop by category</h2>
        </div>
        <Link to="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700">See all <span aria-hidden="true" className="ml-1">→</span></Link>
      </div>
      <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-6">
        {categories.length === 0 && Array.from({ length: 6 }, (_, index) => (
          <div key={index} aria-hidden="true" className="min-w-28 lg:min-w-0">
            <span className="mx-auto block size-20 animate-pulse rounded-3xl bg-violet-50" />
            <span className="mx-auto mt-3 block h-4 w-20 rounded bg-violet-50" />
            <span className="mx-auto mt-1 block h-3.5 w-24 rounded bg-violet-50" />
          </div>
        ))}
        {categories.slice(0, 6).map((category) => (
          <Link key={category.slug} to={`/products?category=${category.slug}`} className="group min-w-28 snap-start text-center focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-violet-700 lg:min-w-0">
            <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-violet-100 bg-white text-violet-700 shadow-sm transition-colors group-hover:bg-violet-100 [&_svg]:size-8"><CategoryIcon slug={category.slug} /></span>
            <span className="mt-3 block text-xs font-semibold text-slate-800">{category.name}</span>
            <span className="mt-1 block text-[10px] text-violet-700">Explore collection →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

type ProductRailProps = {
  title: string;
  eyebrow: string;
  sortBy: "id" | "rating" | "discountPercentage";
  viewAllTo: string;
};

/** Four products from a sorted API request (?limit=4&sortBy=…&order=desc). */
export function ProductRail({ title, eyebrow, sortBy, viewAllTo }: ProductRailProps) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const headingId = `${title.toLowerCase().replaceAll(" ", "-")}-heading`;

  useEffect(() => {
    const controller = new AbortController();
    getSortedProducts(sortBy, "desc", 4, controller.signal)
      .then(setProducts)
      .catch(() => { if (!controller.signal.aborted) setProducts([]); });
    return () => controller.abort();
  }, [sortBy]);

  if (products && products.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-violet-700 uppercase">{eyebrow}</p>
          <h2 id={headingId} className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{title}</h2>
        </div>
        <Link to={viewAllTo} className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-950">View all <span aria-hidden="true" className="ml-1">→</span></Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-4">
        {products
          ? products.map((product) => <ProductCard key={product.id} product={product} />)
          : Array.from({ length: 4 }, (_, index) => <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-violet-50" />)}
      </div>
    </section>
  );
}

const BRANDS = ["SONY", "SAMSUNG", "NIKE", "adidas", "PHILIPS", "LŌRÉAL"];

export function TopBrands() {
  return (
    <section className="mt-10 rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(98,61,140,0.05)] sm:p-8" aria-labelledby="top-brands-heading">
      <div className="flex items-center justify-between">
        <h2 id="top-brands-heading" className="text-xl font-bold text-stone-900">Top brands</h2>
        <Link to="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700">View all <span aria-hidden="true" className="ml-1">→</span></Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {BRANDS.map((brand) => (
          <div key={brand} className="flex min-h-16 items-center justify-center rounded-2xl border border-stone-100 bg-stone-50 px-3 text-center text-sm font-black tracking-tight text-slate-700 grayscale transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800">{brand}</div>
        ))}
      </div>
    </section>
  );
}
