export const PAGE_SIZE = 12;

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
};

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseCatalogParams(params: URLSearchParams): CatalogParams {
  const sort = params.get("sort") ?? "";
  const page = Number(params.get("page") ?? "1");
  return {
    q: (params.get("q") ?? "").trim(),
    // Search and category are mutually exclusive (DummyJSON cannot combine them).
    category: params.get("q") ? "" : params.get("category") ?? "",
    sort: isSortOption(sort) ? sort : "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Builds the catalog URL, leaving out empty values and page 1. */
export function buildCatalogUrl(params: Partial<CatalogParams>): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  else if (params.category) search.set("category", params.category);
  if (params.sort) search.set("sort", params.sort);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/products?${query}` : "/products";
}

/** "price-asc" → { sortBy: "price", order: "asc" } for the DummyJSON API. */
export function toApiSort(sort: SortOption): { sortBy: string; order: "asc" | "desc" } | null {
  if (!sort) return null;
  const [field, order] = sort.split("-");
  return { sortBy: field, order: order === "desc" ? "desc" : "asc" };
}
