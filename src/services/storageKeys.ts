/** Every localStorage key the app uses, in one place. */
export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  profile: "shop_profile",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
