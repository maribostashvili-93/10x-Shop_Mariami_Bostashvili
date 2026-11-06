/** Every localStorage key the app uses, in one place. */
export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  /** Legacy single shared profile; migrated to `profiles` on first load. */
  profile: "shop_profile",
  profiles: "shop_profiles",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
