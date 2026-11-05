import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { OrderData, ShippingInfo } from "../types/order";
import { isProduct } from "../api/products";
import { isRecord } from "../api/client";
import type { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { StorageService } from "../services/StorageService";
import { STORAGE_KEYS } from "../services/storageKeys";
import { useAuth } from "../hooks/useAuth";
import { OrdersContext } from "./orders-context";

const SHIPPING_FIELDS = ["fullName", "email", "phone", "address", "city", "postalCode", "country"] as const;

function isShippingInfo(value: unknown): value is ShippingInfo {
  return isRecord(value) && SHIPPING_FIELDS.every((key) => typeof value[key] === "string");
}

function isOrderData(value: unknown): value is OrderData {
  if (!isRecord(value)) return false;
  const order = value;
  return (
    typeof order.id === "number" &&
    typeof order.number === "string" &&
    typeof order.username === "string" &&
    typeof order.placedAt === "string" &&
    Array.isArray(order.items) &&
    order.items.every((item: unknown) =>
      typeof item === "object" && item !== null && "product" in item && isProduct(item.product) &&
      "quantity" in item && typeof item.quantity === "number") &&
    isShippingInfo(order.shipping) &&
    typeof order.subtotal === "number" &&
    typeof order.discount === "number" &&
    typeof order.shippingCost === "number" &&
    typeof order.total === "number" &&
    (order.promoCode === null || typeof order.promoCode === "string")
  );
}

const isOrderList = (value: unknown): value is OrderData[] => Array.isArray(value) && value.every(isOrderData);
const orderStorage = new StorageService<OrderData[]>(STORAGE_KEYS.orders, isOrderList, []);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<OrderData[]>(() => orderStorage.load());

  // Orders survive logout/login because they are stored per username, not per session.
  useEffect(() => {
    orderStorage.save(allOrders);
  }, [allOrders]);

  const orders = useMemo(
    () => (user ? allOrders.filter((order) => order.username === user.username).map(Order.fromJSON) : []),
    [allOrders, user],
  );

  function placeOrder(cart: Cart, shipping: ShippingInfo): Order {
    // Sequential numbers across all orders saved in this browser: 10X-00001, 10X-00002, ...
    const sequence = allOrders.reduce((max, order) => Math.max(max, Number(order.number.slice(4)) || 0), 0) + 1;
    const order = Order.create(cart, shipping, { username: user?.username ?? "guest", sequence });
    setAllOrders((current) => [order.toJSON(), ...current]);
    return order;
  }

  function clearOrders() {
    setAllOrders([]);
  }

  return <OrdersContext.Provider value={{ orders, placeOrder, clearOrders }}>{children}</OrdersContext.Provider>;
}
