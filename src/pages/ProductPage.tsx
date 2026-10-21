import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProduct } from "../api/products";
import type { Product } from "../types/product";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    getProduct(id)
      .then((data) => setProduct(data))
      .catch(() => setError("Could not load product. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <Link to="/" className="text-blue-600">
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full rounded-lg object-contain"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-4 text-xl">${product.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
