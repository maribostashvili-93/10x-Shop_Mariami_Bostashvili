import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProduct } from "../api/products";
import type { Product } from "../types/product";
import { useCart } from "../hooks/useCart";
import { CartToast } from "../components/ui/CartToast";

const productColors: Record<string, [string, string]> = {
  beauty: ["#f5c6c8", "#a41322"],
  "skin-care": ["#f3d1bd", "#b4533f"],
  fragrances: ["#e4c7d9", "#7a284b"],
  furniture: ["#d9c2aa", "#744b35"],
  "home-decoration": ["#e8d8bc", "#946b3d"],
  "kitchen-accessories": ["#d3e2d4", "#47745a"],
  smartphones: ["#c4d7ec", "#315a86"],
  laptops: ["#c9d0dc", "#475569"],
  tablets: ["#d3d0e8", "#5b4b8a"],
  "mobile-accessories": ["#c7e1e2", "#27757b"],
};

function getProductColors(category: string): [string, string] {
  return productColors[category] ?? ["#f2d7d2", "#7f1d1d"];
}

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

  const [colorOne, colorTwo] = getProductColors(product.category);
  const productGradient = `linear-gradient(135deg, ${colorOne} 0%, ${colorTwo} 100%)`;

  return (
    <div className="pb-10 sm:pb-16">
      <div className="-mx-3 mb-6 bg-stone-100 px-3 py-7 sm:-mx-6 sm:px-6 lg:mb-10"><div className="mx-auto max-w-5xl"><p className="text-right text-2xl font-bold text-stone-900">Shop</p><p className="mt-1 text-right text-xs text-stone-500"><Link to="/" className="hover:text-purple-700">Home</Link> / Shop / Product details</p></div></div>
      <Link to="/" className="inline-flex min-h-11 items-center text-sm font-medium text-stone-600 transition hover:text-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700">
        ← Back to products
      </Link>

      <div className="mt-8 grid gap-8 overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_18px_50px_rgba(67,36,30,0.08)] sm:p-6 md:grid-cols-2 md:gap-12 md:p-10 lg:gap-16">
        <div>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] p-8 sm:p-12" style={{ backgroundImage: productGradient }}>
          <span aria-hidden="true" className="absolute inset-0 bg-white/10" />
        <img
          src={product.thumbnail}
          alt={product.title}
          className="relative h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(63,27,23,0.22)] transition-transform duration-500 hover:scale-105"
        />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {["object-center", "object-left", "object-right", "object-top"].map((position) => <button key={position} type="button" aria-label={`View product image ${position}`} className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-1 transition hover:border-purple-500 focus-visible:outline-2 focus-visible:outline-purple-700"><img src={product.thumbnail} alt="" className={`h-full w-full object-contain ${position}`} /></button>)}
        </div>
        </div>

        <div className="flex flex-col justify-center py-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-900 uppercase">{product.category.replaceAll("-", " ")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>
          <p className="mt-4 text-3xl font-semibold text-red-900">${product.price.toFixed(2)}</p>
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
            <CartToast message={message} onClose={() => setMessage("")} />
          </form>
        </div>
      </div>
      <section className="mx-auto mt-12 max-w-5xl rounded-[1.5rem] bg-white p-5 shadow-[0_10px_30px_rgba(67,36,30,0.05)] sm:p-8" aria-labelledby="product-description">
        <div className="flex gap-6 border-b border-stone-200 text-sm font-semibold"><h2 id="product-description" className="border-b-2 border-purple-700 pb-3 text-purple-800">Description</h2><span className="pb-3 text-stone-400">Additional information</span></div>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-stone-600">{product.description}</p>
        <div className="mt-10 grid gap-8 border-t border-stone-200 pt-8 md:grid-cols-[180px_1fr]">
          <div><p className="text-4xl font-bold text-stone-900">{product.rating.toFixed(1)}</p><p className="mt-1 text-sm text-stone-500">out of 5</p><div className="mt-2 text-amber-500">★★★★★</div><p className="mt-1 text-xs text-stone-500">({Math.max(24, Math.round(product.rating * 49))} reviews)</p></div>
          <div className="space-y-2 text-xs text-stone-500">{[5, 4, 3, 2, 1].map((score) => <div key={score} className="flex items-center gap-3"><span className="w-8">{score} Star</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${score === 5 ? 78 : score === 4 ? 60 : score === 3 ? 24 : 10}%` }} /></div></div>)}</div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-8"><h2 className="text-xl font-bold text-stone-900">Review List</h2><p className="mt-1 text-xs text-stone-500">Showing 1–4 of 24 reviews</p><div className="mt-6 grid gap-6 md:grid-cols-2">{["Kristian Watson", "Jenny Wilson"].map((name) => <article key={name} className="border-b border-stone-100 pb-5"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">{name.split(" ").map((part) => part[0]).join("")}</span><div><p className="text-sm font-semibold text-stone-900">{name}</p><p className="text-xs text-stone-500">Verified buyer</p></div></div><p className="mt-3 text-amber-500">★★★★★</p><p className="mt-2 text-sm leading-6 text-stone-600">Absolutely love this product! The quality and presentation are beautiful.</p></article>)}</div></div>
      </section>
    </div>
  );
}

export default ProductPage;
