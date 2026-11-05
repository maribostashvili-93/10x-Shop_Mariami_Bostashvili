import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";
import { getFinalPrice } from "../utils/formatPrice";

export type PromoCode = {
  code: string;
  percent: number;
};

/** Supported promo codes. Codes are matched case-insensitively. */
export const PROMO_CODES: Record<string, PromoCode> = {
  "10X10": { code: "10X10", percent: 10 },
};

export function findPromoCode(input: string): PromoCode | null {
  return PROMO_CODES[input.trim().toUpperCase()] ?? null;
}

/** Price calculations every cart must provide. */
export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

export type CartTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  count: number;
  /** How much more to spend for free shipping (0 when it already applies). */
  freeShippingRemaining: number;
};

const roundCents = (value: number) => Math.round(value * 100) / 100;

/**
 * Immutable cart model. Item operations return a new Cart, so the reducer can
 * use them without mutating previous state; price rules live here, not in the UI.
 */
export class Cart implements ICart {
  static readonly FREE_SHIPPING_FROM = 100;
  static readonly SHIPPING_COST = 10;

  readonly items: readonly CartItem[];
  private readonly promo: PromoCode | null;

  constructor(items: readonly CartItem[] = [], promoCode: string | null = null) {
    this.items = items;
    this.promo = promoCode ? findPromoCode(promoCode) : null;
  }

  get promoCodeValue(): string | null {
    return this.promo?.code ?? null;
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  quantityOf(productId: number): number {
    return this.items.find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  add(product: Product, quantity: number): Cart {
    if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) return this;

    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      return new Cart(this.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stock) }
          : item,
      ), this.promo?.code ?? null);
    }
    return new Cart([...this.items, { product, quantity: Math.min(quantity, product.stock) }], this.promo?.code ?? null);
  }

  setQuantity(productId: number, quantity: number): Cart {
    if (!Number.isInteger(quantity) || quantity < 1) return this;
    return new Cart(this.items.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item,
    ), this.promo?.code ?? null);
  }

  remove(productId: number): Cart {
    return new Cart(this.items.filter((item) => item.product.id !== productId), this.promo?.code ?? null);
  }

  /** Σ discounted price × quantity. */
  subtotal(): number {
    return roundCents(this.items.reduce((sum, item) => sum + getFinalPrice(item.product) * item.quantity, 0));
  }

  /** Promo code discount on the subtotal. */
  discount(): number {
    return this.promo ? roundCents(this.subtotal() * (this.promo.percent / 100)) : 0;
  }

  /** $10 shipping, free from $100 after discounts; nothing to ship for an empty cart. */
  shipping(): number {
    if (this.items.length === 0) return 0;
    return this.subtotal() - this.discount() >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;
  }

  total(): number {
    return roundCents(this.subtotal() - this.discount() + this.shipping());
  }

  totals(): CartTotals {
    const merchandise = this.subtotal() - this.discount();
    return {
      subtotal: this.subtotal(),
      discount: this.discount(),
      shipping: this.shipping(),
      total: this.total(),
      count: this.itemCount,
      freeShippingRemaining: this.items.length === 0 ? 0 : roundCents(Math.max(0, Cart.FREE_SHIPPING_FROM - merchandise)),
    };
  }
}
