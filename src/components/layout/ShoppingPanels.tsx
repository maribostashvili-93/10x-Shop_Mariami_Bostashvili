import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

export function ShoppingPanels() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
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
  const dialog = { current: { close: () => setOpen(false) } };
  const [mode, setMode] = useState<"cart" | "wishlist">("cart");
  const { items, addToCart, removeFromCart, setQuantity } = useCart();
  const { products, toggle } = useWishlist();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const entries = mode === "cart" ? items : products.map((product) => ({ product, quantity: 1 }));
  const control = "flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-900 disabled:opacity-40";
  return (
    <div ref={container} className="relative ml-2 flex items-center gap-2">
      {(["wishlist", "cart"] as const).map((type) => (
        <button key={type} type="button" aria-expanded={open && mode === type} aria-controls="shopping-panel" aria-label={`Open ${type} (${type === "cart" ? count : products.length} items)`} onClick={() => { setMode(type); setOpen(!open || mode !== type); }} className={`${control} relative border border-slate-200`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
            {type === "cart" ? <><path d="M2 3h3l2.4 12h11.8L22 7H6M8 15l-1 3h12"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></> : <path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7Z"/>}
          </svg>
          <span className="absolute -right-1 -top-1 rounded-full bg-red-900 px-1.5 text-xs text-white">{type === "cart" ? count : products.length}</span>
        </button>
      ))}
      {open && <aside id="shopping-panel" aria-labelledby="shopping-panel-title" className="absolute right-0 top-full z-40 mt-3 max-h-[70dvh] w-[min(340px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h2 id="shopping-panel-title" className="text-xl font-semibold">{mode === "cart" ? `My Cart (${count})` : `My Wishlist (${products.length})`}</h2>
          <button type="button" autoFocus aria-label="Close panel" onClick={() => dialog.current?.close()} className={control}>×</button>
        </div>
        {entries.length === 0 ? <p className="mt-8 text-slate-600">{mode === "cart" ? "Your cart is empty." : "Your wishlist is empty."}</p> : (
          <ul className="mt-6 space-y-5">
            {entries.map(({ product, quantity }) => {
              const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
              return (
                <li key={product.id} className="flex gap-3 border-b border-slate-100 pb-5">
                  <Link to={`/products/${product.id}`} onClick={() => dialog.current?.close()} className="shrink-0"><img src={product.thumbnail} alt={product.title} className="size-20 rounded-xl bg-slate-100 object-contain"/></Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${product.id}`} onClick={() => dialog.current?.close()} className="text-sm font-semibold hover:text-red-900">{product.title}</Link>
                    <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
                    {mode === "cart" ? <div className="mt-2 flex items-center gap-2"><button type="button" aria-label={`Decrease ${product.title}`} disabled={quantity <= 1} onClick={() => setQuantity(product.id, quantity - 1)} className={control}>−</button><span>{quantity}</span><button type="button" aria-label={`Increase ${product.title}`} disabled={quantity >= product.stock} onClick={() => setQuantity(product.id, quantity + 1)} className={control}>+</button></div> : <button type="button" disabled={inCart >= product.stock} onClick={() => addToCart(product, 1)} className="mt-2 min-h-11 rounded-lg bg-red-900 px-3 text-sm font-semibold text-white disabled:opacity-40">{inCart >= product.stock ? "Stock limit reached" : "Add to cart"}</button>}
                    <button type="button" aria-label={`Remove ${product.title}`} onClick={() => mode === "cart" ? removeFromCart(product.id) : toggle(product)} className="min-h-11 text-sm text-red-900 underline">Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {mode === "cart" && <p className="mt-6 flex justify-between font-semibold"><span>Subtotal</span><span>${total.toFixed(2)}</span></p>}
        <Link to={mode === "cart" ? "/cart" : "/wishlist"} onClick={() => dialog.current?.close()} className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-red-900 px-4 font-semibold text-white hover:bg-red-950">{mode === "cart" ? "View cart" : "View wishlist"}</Link>
      </aside>}
    </div>
  );
}
