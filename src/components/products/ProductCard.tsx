import { Link } from "react-router";
import { useRef, useState } from "react";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product";
import { useWishlist } from "../../hooks/useWishlist";
import ProductPrice, { StockStatus } from "./ProductPrice";
import OptionPicker from "./OptionPicker";
import { Cart } from "../../models/Cart";
import { colorFilter, defaultOptions } from "../../models/productOptions";
import { useJustAdded } from "../../hooks/useJustAdded";
import type { ProductOptions } from "../../types/cart";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { products: favorites, toggle } = useWishlist();
  const saved = favorites.some((item) => item.id === product.id);
  const { items, addToCart } = useCart();
  const [options, setOptions] = useState<ProductOptions>(() => defaultOptions(product));
  const [cardAdded, markCardAdded] = useJustAdded();
  const [previewAdded, markPreviewAdded] = useJustAdded();
  // Stock is shared by every colour/size line of this product.
  const available = product.stock > new Cart(items).quantityOf(product.id);
  const actionClass = "flex size-11 items-center justify-center rounded-full bg-white text-red-900 shadow-sm hover:bg-red-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-50";

  /** Quick add from the card uses the first colour and size. */
  function addFromCard() {
    if (!available) return;
    addToCart(product, 1, defaultOptions(product));
    markCardAdded();
  }

  /** Quick view adds the colour and size the shopper picked. */
  function addFromPreview() {
    if (!available) return;
    addToCart(product, 1, options);
    markPreviewAdded();
  }

  const addedClass = "bg-emerald-600 hover:bg-emerald-700";
  const addLabel = (added: boolean) => (product.stock === 0 ? "Out of stock" : added ? "Added ✓" : available ? "Add to cart" : "Max in cart");

  return (
    <article
      className="product-card group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(68,35,35,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(68,35,35,0.1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#faf8ff] product-stage p-6">
        <Link to={`/products/${product.id}`} className="flex h-full w-full items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-red-900">
        <img
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105"
        />
        </Link>
        <div className="absolute right-3 bottom-3 flex gap-2 transition-opacity motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
          {(
            <button type="button" onClick={() => toggle(product)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${product.title} ${saved ? "from" : "to"} wishlist`} title={saved ? "Remove from wishlist" : "Add to wishlist"} className={actionClass}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7Z" /></svg>
            </button>
          )}
          <button type="button" onClick={() => dialog.current?.showModal()} aria-label={`Quick view ${product.title}`} title="Quick view" className={actionClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        {/* Fixed line counts keep every card in a row aligned, whatever the text length. */}
        <p className="truncate text-xs font-semibold tracking-wider text-stone-600 uppercase" title={`${product.category.replaceAll("-", " ")}${product.brand ? ` · ${product.brand}` : ""}`}>{product.category.replaceAll("-", " ")}{product.brand ? ` · ${product.brand}` : ""}</p>
        <h2 className="mt-2 line-clamp-2 min-h-[2lh] text-base leading-snug font-semibold text-stone-900"><Link to={`/products/${product.id}`} className="hover:text-red-900 focus-visible:outline-2 focus-visible:outline-red-900">{product.title}</Link></h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-600">
        <p className="flex items-center gap-1.5">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-amber-600"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" /></svg>
          <span><span className="sr-only">Rating </span>{product.rating.toFixed(1)}</span>
        </p>
        <StockStatus stock={product.stock} />
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <ProductPrice product={product} />
          <button
            type="button"
            onClick={addFromCard}
            disabled={!available}
            className={`min-h-11 w-full rounded-lg px-4 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600 ${cardAdded ? addedClass : "bg-brand-700 hover:bg-brand-800"}`}
          >
            {addLabel(cardAdded)}
            <span className="sr-only">: {product.title}</span>
          </button>
          <span role="status" className="sr-only">{cardAdded ? `${product.title} added to cart` : ""}</span>
        </div>
      </div>
      <dialog ref={dialog} aria-label={`${product.title} quick view`} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/50 sm:p-8">
        <div className="mb-4 flex justify-end">
          <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close quick view" className={actionClass}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="product-stage self-start rounded-xl bg-slate-100 p-4">
            {/* The filter previews the chosen colour on the photo only, not on its background. */}
            <img src={product.thumbnail} alt={`${product.title}, ${options.color}`} style={{ filter: colorFilter(options.color), transition: "filter 200ms ease" }} className="aspect-square w-full object-contain" />
          </div>
          <div>
            <p className="text-sm text-slate-600">{product.category.replaceAll("-", " ")}{product.brand ? ` · ${product.brand}` : ""}</p>
            <h2 className="mt-2 text-2xl font-semibold">{product.title}</h2>
            <div className="mt-4"><ProductPrice product={product} size="lg" /></div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
            <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span><span aria-hidden="true" className="text-amber-500">★</span> {product.rating.toFixed(1)}</span>
              <StockStatus stock={product.stock} />
            </p>
            <div className="mt-5">
              <OptionPicker product={product} value={options} onChange={setOptions} idPrefix={`quick-view-${product.id}`} />
            </div>
            <button
              type="button"
              onClick={addFromPreview}
              disabled={!available}
              className={`mt-6 min-h-11 w-full rounded-lg px-5 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-50 ${previewAdded ? addedClass : "bg-violet-700 hover:bg-violet-800"}`}
            >
              {addLabel(previewAdded)}
            </button>
            <p role="status" className="mt-2 text-sm text-emerald-700">{previewAdded ? `Added: ${options.color} · ${options.size}` : ""}</p>
            <Link to={`/products/${product.id}`} onClick={() => dialog.current?.close()} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 underline focus-visible:outline-2 focus-visible:outline-violet-700">View full details</Link>
          </div>
        </div>
      </dialog>
    </article>
  );
}

export default ProductCard;
