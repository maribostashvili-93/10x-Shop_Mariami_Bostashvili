import type { CartItem } from "./cart";

export type PaymentMethod = "card" | "cash-on-delivery";

/** Delivery and demo payment choice collected at checkout. No real payment data is stored. */
export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
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
