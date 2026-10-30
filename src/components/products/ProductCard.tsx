import { Link } from "react-router";
import { useRef, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { CartToast } from "../ui/CartToast";
import type { Product } from "../../types/product";
import { useWishlist } from "../../hooks/useWishlist";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { products: favorites, toggle } = useWishlist();
  const saved = favorites.some((item) => item.id === product.id);
  const { items, addToCart } = useCart();
  const [message, setMessage] = useState("");
  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const available = product.stock > inCart;
  const actionClass = "flex size-11 items-center justify-center rounded-full bg-white text-red-900 shadow-sm hover:bg-red-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-50";

  function addProduct() {
    if (!available) return;
    addToCart(product, 1);
    setMessage("Added to cart.");
  }

  return (
    <article
      className="product-card group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(68,35,35,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(68,35,35,0.1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f6f1ef] p-6">
        <Link to={`/products/${product.id}`} className="flex h-full w-full items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-red-900">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105"
        />
        </Link>
        <div className="absolute right-3 bottom-3 flex gap-2 transition-opacity motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
          {(
            <button type="button" onClick={() => toggle(product)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${product.title} ${saved ? "from" : "to"} wishlist`} title={saved ? "Remove from wishlist" : "Add to wishlist"} className={actionClass}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7Z" /></svg>
            </button>
          )}
          <button type="button" onClick={addProduct} disabled={!available} aria-label={`Add ${product.title} to cart`} title={available ? "Add to cart" : "No more stock available"} className={actionClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M3 3h2l2.5 12h11L21 7H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
          </button>
          <button type="button" onClick={() => { setMessage(""); dialog.current?.showModal(); }} aria-label={`Quick view ${product.title}`} title="Quick view" className={actionClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">{product.category}</p>
        <h2 className="mt-2 text-base leading-snug font-semibold text-stone-900"><Link to={`/products/${product.id}`} className="hover:text-red-900 focus-visible:outline-2 focus-visible:outline-red-900">{product.title}</Link></h2>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-stone-600">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-amber-600"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" /></svg>
          <span>Rating: {product.rating} / 5</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <p className="text-lg font-semibold text-stone-950">${product.price.toFixed(2)}</p>
          <Link to={`/products/${product.id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-red-800 hover:text-red-950 focus-visible:outline-2 focus-visible:outline-red-900">View details</Link>
        </div>
      </div>
      <CartToast message={message} onClose={() => setMessage("")} />
      <dialog ref={dialog} aria-label={`${product.title} quick view`} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/50 sm:p-8">
        <div className="mb-4 flex justify-end">
          <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close quick view" className={actionClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <img src={product.thumbnail} alt={product.title} className="aspect-square w-full rounded-xl bg-slate-100 object-contain p-4" />
          <div>
            <p className="text-sm text-slate-600">{product.category}</p>
            <h2 className="mt-2 text-2xl font-semibold">{product.title}</h2>
            <p className="mt-4 text-xl font-semibold">${product.price.toFixed(2)}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
            <p className="mt-4 text-sm">Rating: {product.rating} / 5</p>
            <p className="mt-2 text-sm">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
            <button type="button" onClick={addProduct} disabled={!available} className="mt-6 min-h-11 w-full rounded-lg bg-red-900 px-5 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-50">{available ? "Add to cart" : "No more stock available"}</button>
            <Link to={`/products/${product.id}`} onClick={() => dialog.current?.close()} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-red-900 underline focus-visible:outline-2 focus-visible:outline-red-900">View full details</Link>
          </div>
        </div>
      </dialog>
    </article>
  );
}

export default ProductCard;
