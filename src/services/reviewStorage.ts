import type { ProductReview } from "../types/product";
import { StorageService } from "./StorageService";
import { STORAGE_KEYS } from "./storageKeys";

/** Reviews written in this browser, grouped by product ID. */
export type LocalReviews = Record<string, ProductReview[]>;

function isReview(value: unknown): value is ProductReview {
  return (
    typeof value === "object" && value !== null &&
    "rating" in value && typeof value.rating === "number" &&
    "comment" in value && typeof value.comment === "string" &&
    "date" in value && typeof value.date === "string" &&
    "reviewerName" in value && typeof value.reviewerName === "string"
  );
}

function isLocalReviews(value: unknown): value is LocalReviews {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value) &&
    Object.values(value).every((list) => Array.isArray(list) && list.every(isReview))
  );
}

export const reviewStorage = new StorageService<LocalReviews>(STORAGE_KEYS.reviews, isLocalReviews, {});

export function averageRating(reviews: readonly ProductReview[], fallback: number): number {
  if (reviews.length === 0) return fallback;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}
