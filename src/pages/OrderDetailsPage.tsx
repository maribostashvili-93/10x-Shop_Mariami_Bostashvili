import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useNow } from "../hooks/useNow";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import OrderTotals from "../components/cart/OrderTotals";
import { ORDER_STATUSES, getOrderStatus } from "../utils/orderStatus";
import { formatPrice, getFinalPrice } from "../utils/formatPrice";
import NotFoundPage from "./NotFoundPage";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" });

function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { orders } = useOrders();
  const { items: cartItems, addToCart } = useCart();
  const navigate = useNavigate();
  const now = useNow();
  const [message, setMessage] = useState("");

  if (!user) {
    return <Navigate to="/login" state={{ from: `/orders/${id ?? ""}` }} replace />;
  }

  const order = orders.find((item) => item.id === id);
  if (!order) {
    return <NotFoundPage />;
  }

  const status = getOrderStatus(order, now);
  const currentStep = ORDER_STATUSES.indexOf(status);

  function reorder() {
    if (!order) return;
    let added = 0;
    for (const { product, quantity } of order.items) {
      const inCart = cartItems.find((item) => item.product.id === product.id)?.quantity ?? 0;
      const quantityToAdd = Math.min(quantity, Math.max(0, product.stock - inCart));
      if (quantityToAdd > 0) {
        addToCart(product, quantityToAdd);
        added += quantityToAdd;
      }
    }
    if (added === 0) {
      setMessage("These products are already in your cart at the maximum available stock.");
      return;
    }
    navigate("/cart");
  }

  return (
    <section className="py-8">
      <Link to="/orders" className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-brand-700">
        <span aria-hidden="true" className="mr-1">←</span> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Order {order.id}</h1>
          <p className="mt-2 text-sm text-slate-600">Placed {dateFormat.format(new Date(order.createdAt))}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <ol aria-label="Order progress" className="mt-8 grid grid-cols-3 gap-2">
        {ORDER_STATUSES.map((step, index) => (
          <li key={step} aria-current={index === currentStep ? "step" : undefined} className="text-center">
            <span aria-hidden="true" className={`block h-2 rounded-full ${index <= currentStep ? "bg-brand-700" : "bg-slate-200"}`} />
            <span className={`mt-2 block text-xs font-semibold ${index <= currentStep ? "text-brand-800" : "text-slate-500"}`}>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">Status is simulated: orders ship after 2 minutes and are delivered after 5 minutes.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Items</h2>
          <ul className="mt-5 divide-y divide-slate-100">
            {order.items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-4 py-4">
                <img src={product.thumbnail} alt="" width={64} height={64} loading="lazy" className="size-16 rounded-xl bg-slate-100 object-contain" />
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${product.id}`} className="font-semibold text-slate-900 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-brand-700">{product.title}</Link>
                  <p className="text-sm text-slate-600">{quantity} × {formatPrice(getFinalPrice(product))}</p>
                </div>
                <p className="font-semibold text-slate-900">{formatPrice(getFinalPrice(product) * quantity)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit space-y-6 rounded-card border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
            <div className="mt-4"><OrderTotals {...order} size="sm" /></div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Delivery</h2>
            <p className="mt-2 text-sm text-slate-600">
              {order.customer.fullName}<br />{order.customer.address}, {order.customer.city}<br />{order.customer.email}
            </p>
          </div>
          <button type="button" onClick={reorder} className="min-h-11 w-full rounded-lg bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Reorder
          </button>
          {message && <p role="status" className="text-sm text-slate-600">{message}</p>}
        </aside>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
