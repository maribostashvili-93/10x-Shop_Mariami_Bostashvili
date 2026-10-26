import { useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import { WishlistContext } from "./wishlist-context";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  function toggle(product: Product) {
    setProducts((list) => list.some((item) => item.id === product.id)
      ? list.filter((item) => item.id !== product.id) : [...list, product]);
  }

  return <WishlistContext.Provider value={{ products, toggle }}>{children}</WishlistContext.Provider>;
}
