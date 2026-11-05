import type { Product } from "./product";

export type CartItem = {
  product: Product;
  quantity: number;
};

/** Persisted cart state: the items plus an optional applied promo code. */
export type CartState = {
  items: CartItem[];
  promoCode: string | null;
};

/** Every change to the cart is one of these typed actions (a discriminated union). */
export type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };
