import type { Product } from "../types/product";

type ProductsResponse = {
  products: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}
