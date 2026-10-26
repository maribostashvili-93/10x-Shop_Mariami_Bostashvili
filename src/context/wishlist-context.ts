import { createContext } from "react";
import type { Product } from "../types/product";

export const WishlistContext = createContext<{
  products: Product[];
  toggle: (product: Product) => void;
} | undefined>(undefined);
