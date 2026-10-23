import { useContext } from "react";
import { CartContext } from "../context/cart-context";

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
