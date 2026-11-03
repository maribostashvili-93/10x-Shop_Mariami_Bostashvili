import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProduct, getProducts } from "../api/products";
import type { Product } from "../types/product";
import { useCart } from "../hooks/useCart";
import { CartToast } from "../components/ui/CartToast";
import ProductCard from "../components/products/ProductCard";

function ProductPage() {
  const { id } = useParams();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedView, setSelectedView] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Lilac");
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    if (!product) return;
    getProducts(true)
      .then((products) => {
        const available = products.filter((item) => item.id !== product.id);
        const sameCategory = available.filter((item) => item.category === product.category);
        setRelatedProducts([...sameCategory, ...available.filter((item) => item.category !== product.category)].slice(0, 4));
      })
      .catch(() => setRelatedProducts([]));
  }, [product]);

  if (!id) {
    return <p className="text-amber-700">Product ID is missing.</p>;
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="text-amber-700">{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const productGradient = "linear-gradient(135deg, #f1edff 0%, #cfc8f2 100%)";
  const galleryViews = [
    { label: "Lilac", size: "h-[94%] w-[94%]", position: "object-center", filter: "hue-rotate(0deg) saturate(0.9)" },
    { label: "Rose", size: "h-[94%] w-[94%]", position: "object-center", filter: "hue-rotate(315deg) saturate(1.15)" },
    { label: "Sky", size: "h-[94%] w-[94%]", position: "object-center", filter: "hue-rotate(170deg) saturate(0.9)" },
    { label: "Sage", size: "h-[94%] w-[94%]", position: "object-center", filter: "hue-rotate(75deg) saturate(0.85)" },
  ];

  return (
    <div className="pb-10 sm:pb-16">
      <Link to="/" className="inline-flex min-h-11 items-center text-sm font-medium text-stone-600 transition hover:text-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700">
        ← Back to products
      </Link>

      <div className="mt-8 grid gap-8 overflow-hidden rounded-[2rem] border border-violet-100 bg-white p-4 shadow-[0_18px_50px_rgba(76,29,149,0.08)] sm:p-6 md:grid-cols-2 md:gap-8 md:p-6 lg:gap-10">
        <div>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] p-8 sm:p-12" style={{ backgroundImage: productGradient }}>
          <span aria-hidden="true" className="absolute inset-0 bg-white/10" />
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{ filter: galleryViews[selectedView].filter }}
          className={`relative ${galleryViews[selectedView].size} ${galleryViews[selectedView].position} object-contain drop-shadow-[0_18px_18px_rgba(45,20,80,0.25)] transition-all duration-300 hover:scale-105`}
        />
        </div>
        <div className="mt-3 grid grid-cols-4 items-end gap-2">
          {galleryViews.map((view, index) => <button key={view.label} type="button" onClick={() => setSelectedView(index)} aria-label={`View ${view.label} color`} aria-pressed={selectedView === index} className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-violet-50 p-1 transition hover:border-violet-500 focus-visible:outline-2 focus-visible:outline-violet-700 ${selectedView === index ? "border-violet-700 ring-2 ring-violet-200" : "border-violet-100"}`}><img src={product.thumbnail} alt={`${product.title} in ${view.label.toLowerCase()}`} style={{ filter: view.filter }} className={`h-full w-full object-contain ${view.position}`} /></button>)}
        </div>
        </div>

        <div className="flex flex-col justify-center py-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-700 uppercase">{product.category.replaceAll("-", " ")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>
          <p className="mt-4 text-3xl font-semibold text-violet-700">${product.price.toFixed(2)}</p>
          <p className="mt-6 leading-7 text-stone-600">{product.description}</p>
          <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200 text-sm">
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Category</dt><dd className="font-medium text-stone-900">{product.category}</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Rating</dt><dd className="font-medium text-stone-900">{product.rating} / 5</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-500">Availability</dt><dd className="font-medium text-stone-900">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd></div>
          </dl>
          <div className="mt-6 space-y-5">
            <fieldset><legend className="text-sm font-semibold text-stone-900">Color <span className="font-normal text-stone-500">{selectedColor}</span></legend><div className="mt-3 flex flex-wrap gap-2">{["Lilac", "Sage", "Sky", "Rose"].map((color) => <button key={color} type="button" onClick={() => setSelectedColor(color)} aria-pressed={selectedColor === color} className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition ${selectedColor === color ? "border-violet-700 bg-violet-100 text-violet-800 ring-2 ring-violet-200" : "border-stone-200 bg-white text-stone-600 hover:border-violet-300"}`}>{color}</button>)}</div></fieldset>
            <fieldset><legend className="text-sm font-semibold text-stone-900">Size <span className="font-normal text-stone-500">{selectedSize}</span></legend><div className="mt-3 flex flex-wrap gap-2">{["Standard", "Deluxe", "Premium"].map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size} className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition ${selectedSize === size ? "border-violet-700 bg-violet-100 text-violet-800 ring-2 ring-violet-200" : "border-stone-200 bg-white text-stone-600 hover:border-violet-300"}`}>{size}</button>)}</div></fieldset>
          </div>
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
                className="min-h-11 w-24 rounded-lg border border-slate-300 px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!Number.isInteger(quantity) || quantity < 1 || product.stock <= (items.find((item) => item.product.id === product.id)?.quantity ?? 0)}
                className="min-h-11 rounded-lg bg-violet-700 px-6 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to cart
              </button>
            </div>
            {product.stock > 0 && product.stock <= (items.find((item) => item.product.id === product.id)?.quantity ?? 0) && <p className="text-sm text-slate-600">All available stock is in your cart.</p>}
            <CartToast message={message} onClose={() => setMessage("")} />
          </form>
        </div>
      </div>
      <section className="mt-12 rounded-[2rem] bg-[#f4efff] p-5 sm:p-8" aria-labelledby="related-products">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">You may also like</p><h2 id="related-products" className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Shop similar pieces</h2></div>
          <Link to="/products" className="hidden min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-900 sm:inline-flex">View all</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </section>
      <section className="mx-auto mt-12 max-w-5xl rounded-[1.5rem] bg-white p-5 shadow-[0_10px_30px_rgba(67,36,30,0.05)] sm:p-8" aria-labelledby="product-description">
        <div className="flex gap-6 border-b border-stone-200 text-sm font-semibold"><h2 id="product-description" className="border-b-2 border-violet-700 pb-3 text-violet-800">Description</h2><span className="pb-3 text-stone-400">Additional information</span></div>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-stone-600">{product.description}</p>
        <div className="mt-10 grid gap-8 border-t border-stone-200 pt-8 md:grid-cols-[180px_1fr]">
          <div><p className="text-4xl font-bold text-stone-900">{product.rating.toFixed(1)}</p><p className="mt-1 text-sm text-stone-500">out of 5</p><div className="mt-2 text-amber-500">★★★★★</div><p className="mt-1 text-xs text-stone-500">({Math.max(24, Math.round(product.rating * 49))} reviews)</p></div>
          <div className="space-y-2 text-xs text-stone-500">{[5, 4, 3, 2, 1].map((score) => <div key={score} className="flex items-center gap-3"><span className="w-8">{score} Star</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${score === 5 ? 78 : score === 4 ? 60 : score === 3 ? 24 : 10}%` }} /></div></div>)}</div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-bold text-stone-900">Review List</h2>
          <p className="mt-1 text-xs text-stone-500">Showing {Math.min(4 + comments.length, 24)} of 24 reviews</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">{["Kristian Watson", "Jenny Wilson"].map((name) => <article key={name} className="border-b border-stone-100 pb-5"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">{name.split(" ").map((part) => part[0]).join("")}</span><div><p className="text-sm font-semibold text-stone-900">{name}</p><p className="text-xs text-stone-500">Verified buyer</p></div></div><p className="mt-3 text-amber-500">★★★★★</p><p className="mt-2 text-sm leading-6 text-stone-600">Absolutely love this product! The quality and presentation are beautiful.</p></article>)}{comments.map((entry, index) => <article key={`${entry}-${index}`} className="border-b border-stone-100 pb-5"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">YO</span><div><p className="text-sm font-semibold text-stone-900">You</p><p className="text-xs text-stone-500">Just now</p></div></div><p className="mt-3 text-amber-500">★★★★★</p><p className="mt-2 text-sm leading-6 text-stone-600">{entry}</p></article>)}</div>
          <form className="mt-8 rounded-2xl bg-violet-50 p-5" onSubmit={(event) => { event.preventDefault(); if (!comment.trim()) return; setComments((current) => [...current, comment.trim()]); setComment(""); }}>
            <label htmlFor="review-comment" className="text-sm font-semibold text-slate-900">Add a comment</label>
            <textarea id="review-comment" value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Share your experience with this product" className="mt-3 w-full resize-y rounded-xl border border-violet-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200" />
            <button type="submit" className="mt-3 min-h-11 rounded-lg bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">Post comment</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
