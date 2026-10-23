import { useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import { CartContext } from "./cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(product: Product, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stock) }
            : item
        );
      }

      return [...currentItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  function removeFromCart(id: number) {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== id));
  }

  function setQuantity(id: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) return;

    setItems((currentItems) => currentItems.map((item) =>
      item.product.id === id
        ? { ...item, quantity: Math.min(quantity, item.product.stock) }
        : item
    ));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, setQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
