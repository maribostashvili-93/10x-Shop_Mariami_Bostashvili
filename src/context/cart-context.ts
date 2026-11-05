import { createContext } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import type { CartTotals, PromoCode } from "../models/Cart";

type CartContextValue = {
  items: CartItem[];
  promo: PromoCode | null;
  totals: CartTotals;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  /** Returns false when the code is not valid. */
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
