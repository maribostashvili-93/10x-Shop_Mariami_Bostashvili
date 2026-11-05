import type { Product } from "../types/product";
import type { ProductOptions } from "../types/cart";

/**
 * DummyJSON has no product variants, so the store offers its own colour and size
 * choices by category. They do not change the price; they are saved with the cart
 * line and the order so the shopper sees what they picked.
 */
export type ColorOption = { name: string; swatch: string };

const COLORS: readonly ColorOption[] = [
  { name: "Black", swatch: "#1f1f24" },
  { name: "White", swatch: "#f5f5f4" },
  { name: "Silver", swatch: "#c0c4cc" },
  { name: "Lilac", swatch: "#c4b5fd" },
];

const CLOTHING = ["tops", "womens-dresses", "mens-shirts"];
const SHOES = ["womens-shoes", "mens-shoes"];
const MILLILITRES = ["fragrances", "beauty", "skin-care"];

export function getProductOptions(product: Pick<Product, "category">): { colors: readonly ColorOption[]; sizes: readonly string[] } {
  if (CLOTHING.includes(product.category)) return { colors: COLORS, sizes: ["XS", "S", "M", "L", "XL"] };
  if (SHOES.includes(product.category)) return { colors: COLORS, sizes: ["37", "38", "39", "40", "41", "42", "43"] };
  if (MILLILITRES.includes(product.category)) return { colors: COLORS, sizes: ["30 ml", "50 ml", "100 ml"] };
  return { colors: COLORS, sizes: ["One size"] };
}

/** The first colour and size: used by the quick "Add to cart" button on cards. */
export function defaultOptions(product: Pick<Product, "category">): ProductOptions {
  const { colors, sizes } = getProductOptions(product);
  return { color: colors[0].name, size: sizes[0] };
}

/** "Black · M" for cart, checkout and order lines. */
export function describeOptions(options: ProductOptions | undefined): string {
  if (!options) return "";
  return [options.color, options.size].filter(Boolean).join(" · ");
}
