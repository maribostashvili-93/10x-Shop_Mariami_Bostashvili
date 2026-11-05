import type { Order, OrderStatus } from "../types/order";

export const ORDER_STATUSES: readonly OrderStatus[] = ["Processing", "Shipped", "Delivered"];

/** Simulated fulfilment: Processing → Shipped after 2 minutes → Delivered after 5 minutes. */
const SHIPPED_AFTER_MS = 2 * 60 * 1000;
const DELIVERED_AFTER_MS = 5 * 60 * 1000;

export function getOrderStatus(order: Pick<Order, "createdAt">, now: number = Date.now()): OrderStatus {
  const age = now - new Date(order.createdAt).getTime();
  if (age >= DELIVERED_AFTER_MS) return "Delivered";
  if (age >= SHIPPED_AFTER_MS) return "Shipped";
  return "Processing";
}
