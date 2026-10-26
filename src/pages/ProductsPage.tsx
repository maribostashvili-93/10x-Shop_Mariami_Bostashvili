import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import ProductCard from "../components/products/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => { if (active) setProducts(data); })
      .catch(() => { if (active) setError("Could not load products. Please refresh to try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
      <p className="mt-2 text-slate-600">Explore our product collection.</p>
      {loading ? <p role="status" className="mt-6">Loading products...</p> : error ? <p role="alert" className="mt-6 text-red-800">{error}</p> : products.length === 0 ? <p className="mt-6">No products available.</p> : (
        <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
