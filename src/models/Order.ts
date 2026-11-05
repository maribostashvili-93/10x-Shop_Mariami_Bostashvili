import type { CartItem } from "../types/cart";
import type { OrderData, OrderStatus, ShippingInfo } from "../types/order";
import type { Cart } from "./Cart";

export const ORDER_STATUSES: readonly OrderStatus[] = ["Processing", "Shipped", "Delivered"];

const MINUTE = 60 * 1000;

/**
 * A placed order. The status is not stored: it is calculated from the time that
 * has passed since `placedAt`, so the same order always gives the same answer
 * for the same moment and can be tested without waiting.
 */
export class Order {
  static readonly SHIPPED_AFTER_MS = 1 * MINUTE;
  static readonly DELIVERED_AFTER_MS = 3 * MINUTE;

  readonly id: number;
  readonly number: string;
  readonly username: string;
  readonly items: readonly CartItem[];
  readonly shipping: ShippingInfo;
  readonly promoCode: string | null;
  readonly subtotal: number;
  readonly discount: number;
  readonly shippingCost: number;
  readonly total: number;
  readonly placedAt: string;

  private constructor(data: OrderData) {
    this.id = data.id;
    this.number = data.number;
    this.username = data.username;
    this.items = data.items;
    this.shipping = data.shipping;
    this.promoCode = data.promoCode;
    this.subtotal = data.subtotal;
    this.discount = data.discount;
    this.shippingCost = data.shippingCost;
    this.total = data.total;
    this.placedAt = data.placedAt;
  }

  /** Factory: snapshot the cart and delivery details into a new order. */
  static create(cart: Cart, shipping: ShippingInfo, owner: { username: string; sequence: number }, now = new Date()): Order {
    return new Order({
      id: now.getTime(),
      number: Order.formatNumber(owner.sequence),
      username: owner.username,
      items: [...cart.items],
      shipping,
      promoCode: cart.discount() > 0 ? cart.promoCodeValue : null,
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      placedAt: now.toISOString(),
    });
  }

  static fromJSON(data: OrderData): Order {
    return new Order(data);
  }

  /** 1 → "10X-00001" */
  static formatNumber(sequence: number): string {
    return `10X-${String(sequence).padStart(5, "0")}`;
  }

  /** < 1 min Processing, 1–3 min Shipped, > 3 min Delivered. Does not change the order. */
  getStatus(now: Date = new Date()): OrderStatus {
    const elapsed = now.getTime() - new Date(this.placedAt).getTime();
    if (elapsed >= Order.DELIVERED_AFTER_MS) return "Delivered";
    if (elapsed >= Order.SHIPPED_AFTER_MS) return "Shipped";
    return "Processing";
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /** Plain data for localStorage. */
  toJSON(): OrderData {
    return {
      id: this.id,
      number: this.number,
      username: this.username,
      items: [...this.items],
      shipping: this.shipping,
      promoCode: this.promoCode,
      subtotal: this.subtotal,
      discount: this.discount,
      shippingCost: this.shippingCost,
      total: this.total,
      placedAt: this.placedAt,
    };
  }
}
