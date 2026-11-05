import type { OrderStatus } from "../../types/order";

const tones: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-800",
  Shipped: "bg-sky-50 text-sky-800",
  Delivered: "bg-brand-100 text-brand-800",
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status]}`}>{status}</span>;
}

export default OrderStatusBadge;
