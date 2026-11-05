import type { Category, Product, ProductReview } from "../types/product";
import { ApiError, fetchJson, isRecord } from "./client";

const API_URL = "https://dummyjson.com/products";
export const CATALOG_PAGE_SIZE = 12;

const featuredCategories: Record<string, string> = {
  beauty: "Beauty & Care",
  "skin-care": "Skin Rituals",
  fragrances: "Fragrance Edit",
  "womens-dresses": "Dresses & One-Pieces",
  "womens-bags": "Signature Bags",
  sunglasses: "Eyewear Edit",
  "womens-jewellery": "Jewellery Edit",
  "womens-watches": "Timepieces",
  "mens-watches": "Timepieces",
  "home-decoration": "Home Details",
};

function isReview(value: unknown): value is ProductReview {
  return (
    isRecord(value) &&
    typeof value.rating === "number" &&
    typeof value.comment === "string" &&
    typeof value.date === "string" &&
    typeof value.reviewerName === "string"
  );
}

function isOptionalArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): boolean {
  return value === undefined || (Array.isArray(value) && value.every(guard));
}

const isString = (item: unknown): item is string => typeof item === "string";

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.rating === "number" &&
    typeof value.stock === "number" &&
    typeof value.thumbnail === "string" &&
    (value.discountPercentage === undefined || typeof value.discountPercentage === "number") &&
    isOptionalArrayOf(value.images, isString) &&
    isOptionalArrayOf(value.reviews, isReview)
  );
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && typeof value.slug === "string" && typeof value.name === "string" && typeof value.url === "string";
}

function parseProductList(data: unknown): Product[] {
  if (!isRecord(data) || !Array.isArray(data.products)) {
    throw new Error("Unexpected products response");
  }
  return data.products.filter(isProduct);
}

/** CORE catalog request: GET /products?limit=12&skip=0 */
export async function getCatalogProducts(limit = CATALOG_PAGE_SIZE, skip = 0, signal?: AbortSignal): Promise<Product[]> {
  const data = await fetchJson(`${API_URL}?limit=${limit}&skip=${skip}`, signal);
  return parseProductList(data);
}

export async function getProducts(all = false, signal?: AbortSignal): Promise<Product[]> {
  const data = await fetchJson(`${API_URL}${all ? "?limit=0" : ""}`, signal);
  return parseProductList(data).filter((product) => product.category in featuredCategories);
}

/** Resolves to `null` when the product does not exist, so the page can render Not Found. */
export async function getProduct(id: string, signal?: AbortSignal): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    const data = await fetchJson(`${API_URL}/${id}`, signal);
    return isProduct(data) ? data : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson(`${API_URL}/categories`);
  if (!Array.isArray(data)) throw new Error("Unexpected categories response");

  return data
    .filter(isCategory)
    .filter((category) => featuredCategories[category.slug])
    .map((category) => ({ ...category, name: featuredCategories[category.slug] }));
}
