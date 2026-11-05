import { useEffect, useState, type ReactNode } from "react";
import type { NewOrder, Order } from "../types/order";
import { isProduct } from "../api/products";
import { StorageService } from "../services/StorageService";
import { useAuth } from "../hooks/useAuth";
import { OrdersContext } from "./orders-context";

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Record<string, unknown>;
  const customer = order.customer as Record<string, unknown> | null;
  return (
    typeof order.id === "string" &&
    typeof order.username === "string" &&
    typeof order.createdAt === "string" &&
    Array.isArray(order.items) &&
    order.items.every((item: unknown) =>
      typeof item === "object" && item !== null && "product" in item && isProduct(item.product) &&
      "quantity" in item && typeof item.quantity === "number") &&
    typeof customer === "object" && customer !== null &&
    ["fullName", "email", "address", "city"].every((key) => typeof customer[key] === "string") &&
    typeof order.subtotal === "number" &&
    typeof order.discount === "number" &&
    typeof order.promoDiscount === "number" &&
    typeof order.total === "number" &&
    (order.promoCode === null || typeof order.promoCode === "string")
  );
}

const isOrderList = (value: unknown): value is Order[] => Array.isArray(value) && value.every(isOrder);
const orderStorage = new StorageService<Order[]>("10x-orders", isOrderList, []);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>(() => orderStorage.load());

  // Orders survive logout/login because they are stored per username, not per session.
  useEffect(() => {
    orderStorage.save(allOrders);
  }, [allOrders]);

  const orders = user ? allOrders.filter((order) => order.username === user.username) : [];

  function placeOrder(newOrder: NewOrder): Order {
    const order: Order = {
      ...newOrder,
      id: `10X-${Date.now().toString(36).toUpperCase()}`,
      username: user?.username ?? "guest",
      createdAt: new Date().toISOString(),
    };
    setAllOrders((current) => [order, ...current]);
    return order;
  }

  return <OrdersContext.Provider value={{ orders, placeOrder }}>{children}</OrdersContext.Provider>;
}
