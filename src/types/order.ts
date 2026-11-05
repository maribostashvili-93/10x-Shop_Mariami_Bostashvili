import type { CartItem } from "./cart";

/** Delivery details collected at checkout. No payment data exists in this project. */
export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

/** Plain order data as stored in localStorage (see the Order class for behaviour). */
export interface OrderData {
  id: number; // Date.now() when the order was placed
  number: string; // "10X-00001", sequential with five digits
  username: string;
  items: CartItem[];
  shipping: ShippingInfo;
  promoCode: string | null;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string; // ISO date
}
