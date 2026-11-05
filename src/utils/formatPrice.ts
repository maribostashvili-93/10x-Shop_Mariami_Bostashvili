import type { Product } from "../types/product";

/** Final Price = Price × (1 − Discount / 100), rounded to cents. */
export function getFinalPrice(product: Pick<Product, "price" | "discountPercentage">): number {
  const discount = product.discountPercentage ?? 0;
  const safeDiscount = Math.min(Math.max(discount, 0), 100);
  return Math.round(product.price * (1 - safeDiscount / 100) * 100) / 100;
}

export function hasDiscount(product: Pick<Product, "discountPercentage">): boolean {
  return (product.discountPercentage ?? 0) > 0;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
