import type { Category, Product, ProductReview, ProductsResponse } from "../types/product";
import { PAGE_SIZE, toApiSort, type CatalogParams } from "../utils/url";
import { ApiClient, isApiError, isRecord } from "./client";

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

/**
 * FULL catalog request. Only one page (12 products) is downloaded at a time:
 *   ?q=       -> GET /products/search?q=…
 *   ?category -> GET /products/category/{slug}
 *   otherwise -> GET /products
 * Sorting is sent to the API as sortBy/order; skip = (page − 1) × 12.
 */
export async function fetchCatalog(params: CatalogParams, signal?: AbortSignal): Promise<ProductsResponse> {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE), skip: String((params.page - 1) * PAGE_SIZE) });
  const sort = toApiSort(params.sort);
  if (sort) {
    query.set("sortBy", sort.sortBy);
    query.set("order", sort.order);
  }
  const path = params.q
    ? `/products/search?q=${encodeURIComponent(params.q)}&${query}`
    : params.category
      ? `/products/category/${encodeURIComponent(params.category)}?${query}`
      : `/products?${query}`;
  return api.get(path, isProductsResponse, { signal });
}

/** A small sorted list for home page rails, e.g. the 4 best-rated products. */
export async function getSortedProducts(sortBy: "id" | "rating" | "discountPercentage", order: "asc" | "desc", limit = 4, signal?: AbortSignal): Promise<Product[]> {
  const data = await api.get(`/products?limit=${limit}&sortBy=${sortBy}&order=${order}`, isProductsResponse, { signal });
  return data.products;
}

/** Products from one category, used for "related products". */
export async function getProductsByCategory(category: string, limit = 5, signal?: AbortSignal): Promise<Product[]> {
  const data = await api.get(`/products/category/${encodeURIComponent(category)}?limit=${limit}`, isProductsResponse, { signal });
  return data.products;
}

/** Resolves to `null` when the product does not exist, so the page can render Not Found. */
export async function getProduct(id: string, signal?: AbortSignal): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    return await api.get(`/products/${id}`, isProduct, { signal });
  } catch (error) {
    if (isApiError(error) && (error.isNotFound || error.kind === "invalid-response")) return null;
    throw error;
  }
}

/** Every DummyJSON category, for the catalog filter. */
export async function getAllCategories(signal?: AbortSignal): Promise<Category[]> {
  return api.get("/products/categories", isCategoryList, { signal });
}

/** A curated subset with friendlier names, used in the sidebar. */
export async function getCategories(): Promise<Category[]> {
  const data = await api.get("/products/categories", isCategoryList);

  return data
    .filter((category) => featuredCategories[category.slug])
    .map((category) => ({ ...category, name: featuredCategories[category.slug] }));
}
