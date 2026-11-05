import type { OrderStatus } from "../../types/order";

/** Processing — grey, Shipped — blue, Delivered — green. */
const tones: Record<OrderStatus, string> = {
  Processing: "bg-slate-100 text-slate-700",
  Shipped: "bg-sky-100 text-sky-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status]}`}>{status}</span>;
}

export default OrderStatusBadge;
