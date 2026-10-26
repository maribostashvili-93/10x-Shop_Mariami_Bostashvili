import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import type { Category, Product } from "../types/product";
import { getCategories, getProducts } from "../api/products";
import heroImage from "../assets/shop-hero.png";
import { HomeHighlights } from "../components/products/HomeHighlights";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Could not load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategoriesError(true))
      .finally(() => setCategoriesLoading(false));
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f9f2f0] via-[#f3e5e3] to-[#e8cecb] md:min-h-[530px]">
        <div className="relative z-10 flex flex-col justify-center px-7 pt-12 pb-8 sm:px-12 md:min-h-[530px] md:w-[58%] md:py-14 lg:px-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-900 uppercase">The 10X collection</p>
          <h1 className="mt-5 max-w-lg text-4xl leading-[1.08] font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">Discover more.<br /><span className="text-red-900">Love every day.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-stone-600">Explore a collection of products for your style, your home, and your everyday.</p>
          <a href="#products" className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-red-900 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900">Shop products</a>
      <div className="mt-10 grid max-w-xl grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-900"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg></span>
          <div><p className="text-sm font-semibold text-stone-900">Free Shipping</p><p className="mt-1 text-xs text-stone-600">On all orders</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-900"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M12 3 5 6v5c0 4.3 2.7 7.6 7 10 4.3-2.4 7-5.7 7-10V6z" /><path d="m9 12 2 2 4-4" /></svg></span>
          <div className="min-w-0"><p className="text-sm font-semibold text-stone-900">Secure Payment</p><p className="mt-1 text-xs text-stone-600">Safe checkout</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-900"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M4 11a8 8 0 1 1 2.2 5.5" /><path d="M4 5v6h6" /><path d="m9 13 2 2 4-4" /></svg></span>
          <div className="min-w-0"><p className="text-sm font-semibold text-stone-900">Easy Returns</p><p className="mt-1 text-xs text-stone-600">Simple returns</p></div>
        </div>
      </div>
        </div>
        <div className="relative h-72 overflow-hidden sm:h-96 md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[57%]">
          <img src={heroImage} alt="Woman applying lipstick and holding makeup" className="h-full w-full object-contain object-bottom md:object-cover md:object-[60%_top]" />
        </div>
      </div>
      <div id="products" className="mb-5 mt-10 flex items-end justify-between gap-4 scroll-mt-6">
        <div><p className="text-xs font-semibold tracking-wider text-red-900 uppercase">Our collection</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">Featured products</h2></div>
        {products.length > 3 && <button type="button" onClick={() => setShowAllProducts(!showAllProducts)} className="min-h-11 text-sm font-semibold text-red-900 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900">{showAllProducts ? "Show less" : "View all products"}</button>}
      </div>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {(showAllProducts ? products : products.slice(0, 3)).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <section className="mt-16" aria-labelledby="categories-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-stone-900">Shop by category</h2>
          {categories.length > 4 && <button type="button" onClick={() => setShowAllCategories(!showAllCategories)} className="min-h-11 text-sm font-semibold text-red-900 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900">{showAllCategories ? "Show less" : "Explore all"}</button>}
        </div>
        {categoriesLoading ? (
          <p className="mt-6 text-stone-600" role="status">Loading categories...</p>
        ) : categoriesError ? (
          <p className="mt-6 text-red-800" role="alert">Could not load categories. Please try again later.</p>
        ) : categories.length === 0 ? (
          <p className="mt-6 text-stone-600">No categories available yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(showAllCategories ? categories : categories.slice(0, 4)).map((category, index) => {
              const preview = products.find((product) => product.category === category.slug);
              const colors = ["bg-rose-100", "bg-orange-100", "bg-stone-200", "bg-red-100"];
              return (
                <div key={category.slug} className={`relative isolate flex min-h-44 flex-col justify-center overflow-hidden rounded-2xl p-4 ${colors[index % colors.length]}`}>
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/60 text-red-900">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M4 8h16l-1 12H5L4 8Z" /><path d="M8 8V7a4 4 0 0 1 8 0v1" /></svg>
                  </span>
                  <p className="relative z-10 mt-3 max-w-[48%] text-sm font-semibold text-stone-900">{category.name}</p>
                  <p className="relative z-10 mt-1 max-w-[45%] text-xs text-stone-600">Explore the collection</p>
                  {preview && <img src={preview.thumbnail} alt="" loading="lazy" className="absolute right-0 bottom-0 -z-10 h-full w-[55%] object-contain object-bottom" />}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <HomeHighlights products={products} categories={categories} />
    </div>
  );
}
export default HomePage;
