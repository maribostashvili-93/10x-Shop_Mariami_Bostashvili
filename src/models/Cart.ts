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

export type CartTotals = {
  subtotal: number;
  discount: number;
  promoDiscount: number;
  total: number;
  count: number;
};

const roundCents = (value: number) => Math.round(value * 100) / 100;

/**
 * Immutable cart model. Every operation returns a new Cart, so it can be used
 * directly inside a React reducer without mutating previous state.
 */
export class Cart {
  readonly items: readonly CartItem[];

  constructor(items: readonly CartItem[] = []) {
    this.items = items;
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
      ));
    }
    return new Cart([...this.items, { product, quantity: Math.min(quantity, product.stock) }]);
  }

  setQuantity(productId: number, quantity: number): Cart {
    if (!Number.isInteger(quantity) || quantity < 1) return this;
    return new Cart(this.items.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item,
    ));
  }

  remove(productId: number): Cart {
    return new Cart(this.items.filter((item) => item.product.id !== productId));
  }

  clear(): Cart {
    return new Cart();
  }

  totals(promo: PromoCode | null = null): CartTotals {
    const subtotal = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const afterProductDiscounts = this.items.reduce((sum, item) => sum + getFinalPrice(item.product) * item.quantity, 0);
    const promoDiscount = promo ? roundCents(afterProductDiscounts * (promo.percent / 100)) : 0;
    return {
      subtotal: roundCents(subtotal),
      discount: roundCents(subtotal - afterProductDiscounts),
      promoDiscount,
      total: roundCents(afterProductDiscounts - promoDiscount),
      count: this.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
