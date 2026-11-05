import type { CartItem } from "./cart";

export type CheckoutFields = {
  fullName: string;
  email: string;
  address: string;
  city: string;
};

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  username: string;
  createdAt: string;
  items: CartItem[];
  customer: CheckoutFields;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
};

/** Data the checkout supplies; id, owner and timestamp are added when the order is placed. */
export type NewOrder = Omit<Order, "id" | "username" | "createdAt">;
