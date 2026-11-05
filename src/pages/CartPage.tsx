import { Link, useLocation } from "react-router";
import { useToast } from "../hooks/useToast";
import { useCart } from "../hooks/useCart";
import ProductPrice from "../components/products/ProductPrice";
import { formatPrice, getFinalPrice } from "../utils/formatPrice";
import OrderTotals from "../components/cart/OrderTotals";
import PromoCodeForm from "../components/cart/PromoCodeForm";
import { Cart } from "../models/Cart";
import { describeOptions } from "../models/productOptions";

function CartPage() {
  const { items, totals, promo, removeFromCart, setQuantity, clearCart } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  // Checkout sends shoppers back here with a short explanation when the cart is empty.
  const notice = typeof location.state === "object" && location.state !== null && "notice" in location.state && typeof location.state.notice === "string" ? location.state.notice : "";

  const cart = new Cart(items);

  function removeItem(lineId: string) {
    removeFromCart(lineId);
    showToast("Removed from cart", "info");
  }

  function confirmClear() {
    if (window.confirm("Clear the cart? This cannot be undone.")) clearCart();
  }

  if (items.length === 0) {
    return (
      <section className="py-10">
        {notice && <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">{notice}</p>}
        <h1 className="text-3xl font-semibold text-slate-900">
          Your cart is empty.
        </h1>

        <Link
          to="/products"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h1 className="text-3xl font-semibold text-slate-900">Your cart</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const { product, quantity, options } = item;
            const lineId = Cart.lineId(item);
            const optionText = describeOptions(options);
            // Other colour/size lines of the same product share its stock.
            const canIncrease = cart.quantityOf(product.id) < product.stock;
            return (
            <li
              key={lineId}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  width={112}
                  height={112}
                  className="size-28 rounded-xl bg-slate-100 object-contain"
                />

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-semibold text-slate-900 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                  >
                    {product.title}
                  </Link>
                  {options && (
                    <p className="mt-1 text-sm text-slate-600">
                      Color: <span className="font-medium text-slate-800">{options.color}</span> · Size: <span className="font-medium text-slate-800">{options.size}</span>
                    </p>
                  )}

                  <div className="mt-2 text-sm text-slate-600">
                    <span className="sr-only">Unit price</span>
                    <ProductPrice product={product} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div
                      role="group"
                      aria-label={`Quantity for ${product.title}${optionText ? `, ${optionText}` : ""}`}
                      className="flex items-center gap-3"
                    >
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.title}`}
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(lineId, quantity - 1)}
                        className="size-11 rounded-lg border border-slate-300 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-6 text-center font-medium">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.title}`}
                        disabled={!canIncrease}
                        onClick={() => setQuantity(lineId, quantity + 1)}
                        className="size-11 rounded-lg border border-slate-300 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${product.title}${optionText ? ` (${optionText})` : ""} from cart`}
                      onClick={() => removeItem(lineId)}
                      className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="mt-4 font-semibold text-slate-900">
                    Item total: {formatPrice(getFinalPrice(product) * quantity)}
                  </p>
                </div>
              </div>
            </li>
            );
          })}
        </ul>

        <aside
          aria-labelledby="summary-heading"
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2
            id="summary-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Order summary
          </h2>

          <div className="mt-6">
            <PromoCodeForm />
          </div>

          <div className="mt-6">
            <OrderTotals {...totals} promoCode={promo?.code ?? null} />
          </div>

          <Link
            to="/checkout"
            className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-violet-700 px-4 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            Proceed to checkout
          </Link>
          <button
            type="button"
            onClick={confirmClear}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
