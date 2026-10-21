import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import type { Product } from "../types/product";
import { getProducts } from "../api/products";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Could not load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
export default HomePage;
