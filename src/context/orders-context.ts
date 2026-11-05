import { createContext } from "react";
import type { Cart } from "../models/Cart";
import type { Order } from "../models/Order";
import type { ShippingInfo } from "../types/order";

type OrdersContextValue = {
  /** Orders that belong to the signed-in user, newest first. */
  orders: Order[];
  placeOrder: (cart: Cart, shipping: ShippingInfo) => Order;
  clearOrders: () => void;
};

export const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);
