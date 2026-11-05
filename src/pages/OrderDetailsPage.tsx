import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useNow } from "../hooks/useNow";
import { useToast } from "../hooks/useToast";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import OrderTotals from "../components/cart/OrderTotals";
import { ORDER_STATUSES } from "../models/Order";
import { Cart } from "../models/Cart";
import { colorFilter, describeOptions } from "../models/productOptions";
import { formatDate, formatPrice, getFinalPrice } from "../utils/formatPrice";
import NotFoundPage from "./NotFoundPage";

function isJustPlaced(state: unknown): boolean {
  return typeof state === "object" && state !== null && "justPlaced" in state && state.justPlaced === true;
}

function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { orders } = useOrders();
  const { items: cartItems, addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const now = useNow(30_000);

  if (!user) {
    return <Navigate to="/login" state={{ from: `/orders/${id ?? ""}` }} replace />;
  }

  const order = orders.find((item) => String(item.id) === id);
  if (!order) {
    return <NotFoundPage />;
  }

  const status = order.getStatus(new Date(now));
  const currentStep = ORDER_STATUSES.indexOf(status);

  function reorder() {
    if (!order) return;
    // Simulate the additions with the Cart class so stock limits match the reducer.
    let added = 0;
    let preview = new Cart(cartItems);
    for (const { product, quantity, options } of order.items) {
      const next = preview.add(product, quantity, options);
      const quantityToAdd = next.quantityOf(product.id) - preview.quantityOf(product.id);
      if (quantityToAdd > 0) {
        addToCart(product, quantityToAdd, options);
        added += quantityToAdd;
      }
      preview = next;
    }
    if (added === 0) {
      showToast("These items are already in your cart at the maximum stock.", "info");
      return;
    }
    showToast("Items added to cart ✓");
    navigate("/cart");
  }

  return (
    <section className="py-8">
      {isJustPlaced(location.state) && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-900">
          Thank you! Your order has been placed.
        </p>
      )}

      <Link to="/orders" className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-brand-700">
        <span aria-hidden="true" className="mr-1">←</span> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Order #{order.number}</h1>
          <p className="mt-2 text-sm text-slate-600">Placed {formatDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <ol aria-label="Order progress" className="mt-8 grid grid-cols-3 gap-2">
        {ORDER_STATUSES.map((step, index) => (
          <li key={step} aria-current={index === currentStep ? "step" : undefined} className="text-center">
            <span aria-hidden="true" className={`block h-2 rounded-full ${index <= currentStep ? "bg-emerald-600" : "bg-slate-200"}`} />
            <span className={`mt-2 block text-xs font-semibold ${index <= currentStep ? "text-emerald-800" : "text-slate-600"}`}>
              {step} <span aria-hidden="true">{index <= currentStep ? "✓" : "○"}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">Status is simulated: Processing for the first minute, Shipped until three minutes, then Delivered.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-card border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Items</h2>
          <table className="mt-5 w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="pb-2 font-semibold">Product</th>
                <th scope="col" className="pb-2 text-right font-semibold">Qty</th>
                <th scope="col" className="hidden pb-2 text-right font-semibold sm:table-cell">Unit price</th>
                <th scope="col" className="pb-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map(({ product, quantity, options }) => (
                <tr key={Cart.lineId({ product, options })}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="product-stage size-12 shrink-0 rounded-lg bg-slate-100"><img src={product.thumbnail} alt="" style={{ filter: colorFilter(options?.color) }} width={48} height={48} loading="lazy" className="size-12 object-contain" /></span>
                      <div>
                        <Link to={`/products/${product.id}`} className="font-semibold text-slate-900 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-brand-700">{product.title}</Link>
                        {options && <p className="text-xs text-slate-600">{describeOptions(options)}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right">{quantity}</td>
                  <td className="hidden py-3 text-right sm:table-cell">{formatPrice(getFinalPrice(product))}</td>
                  <td className="py-3 text-right font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="h-fit space-y-6 rounded-card border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
            <div className="mt-4">
              <OrderTotals subtotal={order.subtotal} discount={order.discount} shipping={order.shippingCost} total={order.total} promoCode={order.promoCode} size="sm" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Delivery address</h2>
            <p className="mt-2 text-sm text-slate-600">
              {order.shipping.fullName}<br />
              {order.shipping.address}, {order.shipping.city} {order.shipping.postalCode}<br />
              {order.shipping.country}<br />
              {order.shipping.email} · {order.shipping.phone}
            </p>
          </div>
          <button type="button" onClick={reorder} className="min-h-11 w-full rounded-lg bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Reorder
          </button>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
