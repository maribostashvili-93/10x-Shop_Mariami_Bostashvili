import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { defaultOptions } from "../../models/productOptions";
import { Cart } from "../../models/Cart";
import { formatPrice, getFinalPrice } from "../../utils/formatPrice";

/** Header wishlist button with a quick panel. The cart has its own header link (CartLink). */
export function ShoppingPanels() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const { items, addToCart } = useCart();
  const { products, toggle } = useWishlist();
  const cart = new Cart(items);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!(event.target instanceof Node) || !container.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const control = "flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-violet-800 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-700 disabled:opacity-40";
  const close = () => setOpen(false);

  return (
    <div ref={container} className="relative ml-2 flex items-center gap-2">
      <button type="button" aria-expanded={open} aria-controls="shopping-panel" onClick={() => setOpen(!open)} className={`${control} relative border border-slate-200`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7Z"/>
        </svg>
        {/* Accessible name ("Wishlist 2 items") is built from the visible count. */}
        <span className="sr-only">Wishlist&nbsp;</span>
        <span className="absolute -right-1 -top-1 rounded-full bg-violet-950 px-1.5 text-xs text-white">
          {products.length}
          <span className="sr-only">&nbsp;items</span>
        </span>
      </button>
      {open && (
        <aside id="shopping-panel" aria-labelledby="shopping-panel-title" className="absolute right-0 top-full z-40 mt-3 max-h-[70dvh] w-[min(340px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 id="shopping-panel-title" className="text-xl font-semibold">My Wishlist ({products.length})</h2>
            <button type="button" autoFocus aria-label="Close panel" onClick={close} className={control}>×</button>
          </div>
          {products.length === 0 ? <p className="mt-8 text-slate-600">Your wishlist is empty.</p> : (
            <ul className="mt-6 space-y-5">
              {products.map((product) => {
                const full = cart.quantityOf(product.id) >= product.stock;
                return (
                  <li key={product.id} className="flex gap-3 border-b border-slate-100 pb-5">
                    <Link to={`/products/${product.id}`} onClick={close} className="shrink-0"><img src={product.thumbnail} alt={product.title} className="product-stage size-20 rounded-xl bg-slate-100 object-contain"/></Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${product.id}`} onClick={close} className="text-sm font-semibold hover:text-violet-800">{product.title}</Link>
                      <p className="mt-2 font-semibold">{formatPrice(getFinalPrice(product))}</p>
                      <button type="button" disabled={full} onClick={() => addToCart(product, 1, defaultOptions(product))} className="mt-2 min-h-11 rounded-lg bg-violet-700 px-3 text-sm font-semibold text-white disabled:opacity-40">{full ? "Stock limit reached" : "Add to cart"}</button>
                      <button type="button" aria-label={`Remove ${product.title}`} onClick={() => toggle(product)} className="ml-3 min-h-11 text-sm text-violet-800 underline">Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link to="/wishlist" onClick={close} className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-violet-700 px-4 font-semibold text-white hover:bg-violet-800">View wishlist</Link>
        </aside>
      )}
    </div>
  );
}
