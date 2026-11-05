import type { Product } from "../types/product";
import { getFinalPrice } from "./formatPrice";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Rating: high to low" },
  { value: "name-asc", label: "Name A–Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type CatalogFilters = {
  query: string;
  category: string;
  price: string;
  sort: string;
};

function matchesPrice(product: Product, price: string): boolean {
  const finalPrice = getFinalPrice(product);
  if (price === "under-50") return finalPrice < 50;
  if (price === "50-100") return finalPrice >= 50 && finalPrice <= 100;
  if (price === "over-100") return finalPrice > 100;
  return true;
}

const comparators: Record<Exclude<SortOption, "">, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => getFinalPrice(a) - getFinalPrice(b),
  "price-desc": (a, b) => getFinalPrice(b) - getFinalPrice(a),
  rating: (a, b) => b.rating - a.rating,
  "name-asc": (a, b) => a.title.localeCompare(b.title, "en"),
};

function isSortOption(value: string): value is Exclude<SortOption, ""> {
  return value in comparators;
}

export function filterAndSortProducts(products: Product[], { query, category, price, sort }: CatalogFilters): Product[] {
  const search = query.trim().toLowerCase();
  const filtered = products.filter((product) =>
    (!category || product.category === category) &&
    matchesPrice(product, price) &&
    (!search || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(search)),
  );
  return isSortOption(sort) ? [...filtered].sort(comparators[sort]) : filtered;
}

/** Generic pagination: skip = (page − 1) × pageSize, with the page clamped to the valid range. */
export function paginate<T>(items: readonly T[], requestedPage: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const skip = (page - 1) * pageSize;
  return { page, totalPages, skip, pageItems: items.slice(skip, skip + pageSize) };
}
