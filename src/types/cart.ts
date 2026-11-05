import type { Product } from "./product";

/** Colour and size chosen for a cart line (see models/productOptions.ts). */
export type ProductOptions = {
  color: string;
  size: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  /** Missing on carts saved before options existed. */
  options?: ProductOptions;
};

/** Persisted cart state: the items plus an optional applied promo code. */
export type CartState = {
  items: CartItem[];
  promoCode: string | null;
};

/** Every change to the cart is one of these typed actions (a discriminated union). */
export type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number; options?: ProductOptions }
  | { type: "SET_QTY"; lineId: string; qty: number }
  | { type: "REMOVE_ITEM"; lineId: string }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };
