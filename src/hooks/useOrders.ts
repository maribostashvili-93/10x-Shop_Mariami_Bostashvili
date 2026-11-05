import { useContext } from "react";
import { OrdersContext } from "../context/orders-context";

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}
