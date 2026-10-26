import { useState } from "react";
import { Link } from "react-router";
import type { Category, Product } from "../../types/product";
import ProductCard from "./ProductCard";

export function HomeHighlights({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [slide, setSlide] = useState(0);
  const rated = [...products].sort((a, b) => b.rating - a.rating);
  const groups = categories.map((category) => ({
    ...category,
    products: products.filter((product) => product.category === category.slug),
  })).filter((category) => category.products.length > 0).sort((a, b) => b.products.length - a.products.length);
  const pageSize = Math.max(1, Math.ceil(groups.length / 3));
  const average = products.length ? products.reduce((sum, product) => sum + product.rating, 0) / products.length : 0;

  return (
    <div className="mt-12 space-y-12">
      <section aria-labelledby="collection-stats" className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-red-800 to-rose-500 p-6 text-white sm:p-8">
        <div className="grid items-center gap-8 xl:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-100 uppercase">Discover 10X Shop</p>
            <h2 id="collection-stats" className="mt-3 text-2xl font-semibold">Everyday finds. More possibilities.</h2>
            <p className="mt-3 text-sm leading-6 text-red-50">Explore beauty, home and everyday essentials in one place.</p>
            <Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-5 text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explore products</Link>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center">
            {[[String(products.length), "Loaded products"], [String(categories.length), "Categories"], [average.toFixed(1), "Avg. product rating"]].map(([value, label]) => (
              <div key={label}><dt className="mt-2 text-xs text-red-50">{label}</dt><dd className="mt-2 text-2xl font-semibold sm:text-3xl">{value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="popular-categories">
        <h2 id="popular-categories" className="text-2xl font-semibold text-slate-900">Popular categories</h2>
        <p className="mt-2 text-sm text-slate-600">Categories with the most products in the loaded collection.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          {groups.slice(slide * pageSize, (slide + 1) * pageSize).map((category) => (
            <div key={category.slug} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <img src={category.products[0].thumbnail} alt="" loading="lazy" className="size-24 rounded-xl bg-rose-50 object-contain" />
              <div><h3 className="font-semibold text-slate-900">{category.name}</h3><p className="mt-2 text-sm text-slate-600">{category.products.length} loaded products</p></div>
            </div>
          ))}
          {groups.length === 0 && <p className="text-slate-600">No categories available.</p>}
        </div>
        <div className="mt-4 flex justify-center" aria-label="Category slides">
          {[0, 1, 2].map((page) => <button key={page} type="button" aria-label={`Show category slide ${page + 1}`} aria-pressed={slide === page} onClick={() => setSlide(page)} className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-red-900"><span className={`h-2.5 rounded-full ${slide === page ? "w-6 bg-red-900" : "w-2.5 bg-slate-300"}`} /></button>)}
        </div>
      </section>

      <section aria-labelledby="top-rated">
        <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="top-rated" className="text-2xl font-semibold text-slate-900">Top-rated products</h2><Link to="/products" className="inline-flex min-h-11 items-center font-semibold text-red-900 underline">View all</Link></div>
        <p className="mt-2 text-sm text-slate-600">Customer favorites by product rating.</p>
        <div className="mt-6 grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">{rated.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section aria-labelledby="customer-feedback" className="rounded-2xl bg-rose-50 p-6 sm:p-8">
        <h2 id="customer-feedback" className="text-2xl font-semibold text-slate-900">What shoppers think</h2>
        <p className="mt-2 text-sm text-slate-600">Demo testimonials — illustrative content, not real customer reviews.</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {["I like being able to see product details before adding an item to my cart.", "The wishlist makes it easy to keep my favorite finds together.", "Clear prices and quantity controls make browsing straightforward."].map((quote, index) => (
            <figure key={quote} className="rounded-xl bg-white p-5"><blockquote className="text-sm leading-7 text-slate-700">“{quote}”</blockquote><figcaption className="mt-4 text-xs font-semibold text-red-900">Demo shopper {index + 1}</figcaption></figure>
          ))}
        </div>
      </section>
    </div>
  );
}
