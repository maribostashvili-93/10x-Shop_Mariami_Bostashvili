import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import { useNow } from "../hooks/useNow";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import { formatDate, formatPrice } from "../utils/formatPrice";

function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  // Re-calculate statuses every 30 seconds without a reload.
  const now = useNow(30_000);

  if (!user) {
    return <Navigate to="/login" state={{ from: "/orders" }} replace />;
  }

  return (
    <section className="py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Your account</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-card bg-white p-6">
          <p className="font-semibold text-slate-900">You have no orders yet.</p>
          <Link to="/" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="flex flex-col gap-3 rounded-card border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">Order #{order.number}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(order.placedAt)} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.getStatus(new Date(now))} />
                  <span className="font-semibold text-slate-900">{formatPrice(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default OrdersPage;
