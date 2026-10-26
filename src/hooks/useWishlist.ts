import { useContext } from "react";
import { WishlistContext } from "../context/wishlist-context";

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
