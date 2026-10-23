import { createContext } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
