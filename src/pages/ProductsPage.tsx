import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import ProductCard from "../components/products/ProductCard";
import { Link, useSearchParams } from "react-router";

export default function ProductsPage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const price = params.get("price") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts(true)
      .then((data) => { if (active) setProducts(data); })
      .catch(() => { if (active) setError("Could not load products. Please refresh to try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = products.filter((product) =>
    (!category || product.category === category) &&
    (price === "under-50" ? product.price < 50 : price === "50-100" ? product.price >= 50 && product.price <= 100 : price === "over-100" ? product.price > 100 : true) &&
    (!query || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query)),
  ).sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);

  return (
    <section>
      <h1 className="text-xl font-semibold text-slate-900 sm:text-3xl">Shop</h1>
      <p aria-live="polite" className="mt-2 text-sm text-slate-600">{loading ? "Explore our product collection." : `${filtered.length} products${category ? ` in ${category.replaceAll("-", " ")}` : ""}${query ? ` matching “${params.get("q")}”` : ""}`}</p>
      {loading ? <p role="status" className="mt-6">Loading products...</p> : error ? <p role="alert" className="mt-6 text-red-800">{error}</p> : filtered.length === 0 ? <div className="mt-6 rounded-2xl bg-white p-5"><p>No products match your search and category.</p><Link to="/products" className="mt-3 inline-flex min-h-11 items-center font-semibold text-red-900 underline">Clear filters</Link></div> : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-3">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
