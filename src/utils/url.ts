export const PAGE_SIZE = 12;

/** "Best deals" lists products with at least this discount. Every product keeps its own badge. */
export const DEALS_MIN_DISCOUNT = 15;

export const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A→Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

/** Catalog (/products) state lives in the URL: ?q=, ?category=, ?sort= and ?page=. */
export type CatalogParams = {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
  /** ?deals=1 — only products with a discount of DEALS_MIN_DISCOUNT % or more. */
  deals: boolean;
};

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseCatalogParams(params: URLSearchParams): CatalogParams {
  const sort = params.get("sort") ?? "";
  const page = Number(params.get("page") ?? "1");
  const deals = params.get("deals") === "1";
  return {
    // Best deals is its own list (sorted by discount), so search, category and sort do not apply.
    q: deals ? "" : (params.get("q") ?? "").trim(),
    // Search and category are mutually exclusive (DummyJSON cannot combine them).
    category: deals || params.get("q") ? "" : params.get("category") ?? "",
    sort: !deals && isSortOption(sort) ? sort : "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
    deals,
  };
}

/** Builds the catalog URL, leaving out empty values and page 1. */
export function buildCatalogUrl(params: Partial<CatalogParams>): string {
  const search = new URLSearchParams();
  if (params.deals) search.set("deals", "1");
  else if (params.q) search.set("q", params.q);
  else if (params.category) search.set("category", params.category);
  if (params.sort && !params.deals) search.set("sort", params.sort);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/products?${query}` : "/products";
}

const LAST_CATALOG_KEY = "shop_last_catalog";

/** Remembers the catalog view (filters, sort, page) the shopper last saw in this tab. */
export function rememberCatalogUrl(url: string): void {
  try {
    sessionStorage.setItem(LAST_CATALOG_KEY, url);
  } catch {
    // Storage can be disabled; "Back to catalog" then opens the plain catalog.
  }
}

/** The catalog view to return to from a product page; the plain catalog if none was seen. */
export function lastCatalogUrl(): string {
  try {
    const url = sessionStorage.getItem(LAST_CATALOG_KEY);
    return url && url.startsWith("/products") ? url : "/products";
  } catch {
    return "/products";
  }
}

/** "price-asc" → { sortBy: "price", order: "asc" } for the DummyJSON API. */
export function toApiSort(sort: SortOption): { sortBy: string; order: "asc" | "desc" } | null {
  if (!sort) return null;
  const [field, order] = sort.split("-");
  return { sortBy: field, order: order === "desc" ? "desc" : "asc" };
}
