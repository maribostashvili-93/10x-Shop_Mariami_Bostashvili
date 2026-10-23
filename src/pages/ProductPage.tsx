import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProduct } from "../api/products";
import type { Product } from "../types/product";
import { useCart } from "../hooks/useCart";

function ProductPage() {
  const { id } = useParams();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    getProduct(id)
      .then((data) => setProduct(data))
      .catch(() => setError("Could not load product. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return <p className="text-red-600">Product ID is missing.</p>;
  }

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
    <div className="py-4 sm:py-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-stone-600 transition hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900">
        Back to products
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-100 p-8">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain"
        />
        </div>

        <div className="flex flex-col justify-center py-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">${product.price.toFixed(2)}</p>
          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
          <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200 text-sm">
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Category</dt><dd className="font-medium text-stone-900">{product.category}</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Rating</dt><dd className="font-medium text-stone-900">{product.rating} / 5</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Availability</dt><dd className="font-medium text-stone-900">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd></div>
          </dl>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
              const available = Math.max(0, product.stock - inCart);
              if (available < 1) return;
              const added = Math.min(quantity, available);
              addToCart(product, added);
              setMessage(`${added} added to cart.`);
              setQuantity(1);
            }}
          >
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-900">Quantity</label>
            <div className="flex flex-wrap gap-3">
              <input
                id="quantity"
                type="number"
                min={1}
                max={Math.max(1, product.stock - (items.find((item) => item.product.id === product.id)?.quantity ?? 0))}
                required
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.valueAsNumber);
                  setMessage("");
                }}
                disabled={product.stock <= (items.find((item) => item.product.id === product.id)?.quantity ?? 0)}
                className="min-h-11 w-24 rounded-lg border border-slate-300 px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!Number.isInteger(quantity) || quantity < 1 || product.stock <= (items.find((item) => item.product.id === product.id)?.quantity ?? 0)}
                className="min-h-11 rounded-lg bg-red-900 px-6 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to cart
              </button>
            </div>
            {product.stock > 0 && product.stock <= (items.find((item) => item.product.id === product.id)?.quantity ?? 0) && <p className="text-sm text-slate-600">All available stock is in your cart.</p>}
            <p role="status" className="text-sm text-slate-600">{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
