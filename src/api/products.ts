import type { Category, Product, ProductReview, ProductsResponse } from "../types/product";
import { ApiClient, ApiError, isRecord } from "./client";

const api = new ApiClient("https://dummyjson.com");
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
    (value.brand === undefined || typeof value.brand === "string") &&
    (value.discountPercentage === undefined || typeof value.discountPercentage === "number") &&
    isOptionalArrayOf(value.images, isString) &&
    isOptionalArrayOf(value.reviews, isReview)
  );
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && typeof value.slug === "string" && typeof value.name === "string" && typeof value.url === "string";
}

export function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct) &&
    typeof value.total === "number" &&
    typeof value.skip === "number" &&
    typeof value.limit === "number"
  );
}

const isCategoryList = (value: unknown): value is Category[] => Array.isArray(value) && value.every(isCategory);

/** CORE catalog request: GET /products?limit=12&skip=0 */
export async function getCatalogProducts(limit = CATALOG_PAGE_SIZE, skip = 0, signal?: AbortSignal): Promise<Product[]> {
  const data = await api.get(`/products?limit=${limit}&skip=${skip}`, isProductsResponse, { signal });
  return data.products;
}

export async function getProducts(all = false, signal?: AbortSignal): Promise<Product[]> {
  const data = await api.get(`/products${all ? "?limit=0" : ""}`, isProductsResponse, { signal });
  return data.products.filter((product) => product.category in featuredCategories);
}

/** Products from one category, used for "related products". */
export async function getProductsByCategory(category: string, signal?: AbortSignal): Promise<Product[]> {
  const data = await api.get(`/products/category/${encodeURIComponent(category)}?limit=0`, isProductsResponse, { signal });
  return data.products;
}

/** Resolves to `null` when the product does not exist, so the page can render Not Found. */
export async function getProduct(id: string, signal?: AbortSignal): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    return await api.get(`/products/${id}`, isProduct, { signal });
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.kind === "invalid-response")) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const data = await api.get("/products/categories", isCategoryList);

  return data
    .filter((category) => featuredCategories[category.slug])
    .map((category) => ({ ...category, name: featuredCategories[category.slug] }));
}
