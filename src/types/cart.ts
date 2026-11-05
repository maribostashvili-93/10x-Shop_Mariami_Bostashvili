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
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQuantity"; productId: number; quantity: number }
  | { type: "remove"; productId: number }
  | { type: "clear" }
  | { type: "applyPromo"; code: string }
  | { type: "removePromo" };
