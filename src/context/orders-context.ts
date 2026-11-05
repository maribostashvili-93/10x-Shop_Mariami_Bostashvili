import { createContext } from "react";
import type { NewOrder, Order } from "../types/order";

type OrdersContextValue = {
  /** Orders that belong to the signed-in user, newest first. */
  orders: Order[];
  placeOrder: (order: NewOrder) => Order;
};

export const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);
