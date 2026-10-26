import { Link } from "react-router";
import { useCart } from "../hooks/useCart";

function CartPage() {
  const { items, removeFromCart, setQuantity } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <section className="py-10">
        <h1 className="text-3xl font-semibold text-slate-900">
          Your cart is empty
        </h1>

        <p className="mt-3 text-slate-600">
          Add some products to start shopping.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-red-900 px-5 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
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
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
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

                  <p className="mt-2 text-sm text-slate-600">
                    Unit price: ${product.price.toFixed(2)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div
                      role="group"
                      aria-label={`Quantity for ${product.title}`}
                      className="flex items-center gap-3"
                    >
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.title}`}
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(product.id, quantity - 1)}
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
                        disabled={quantity >= product.stock}
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        className="size-11 rounded-lg border border-slate-300 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${product.title} from cart`}
                      onClick={() => removeFromCart(product.id)}
                      className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="mt-4 font-semibold text-slate-900">
                    Item total: ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}
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

          <dl className="mt-6">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold text-slate-900">
                ${total.toFixed(2)}
              </dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-red-900 px-4 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
