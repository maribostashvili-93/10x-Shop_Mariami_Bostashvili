import type { Category, Product } from "../types/product";

type ProductsResponse = {
  products: Product[];
};

export async function getProducts(all = false): Promise<Product[]> {
  const response = await fetch(`https://dummyjson.com/products${all ? "?limit=0" : ""}`);

  if (!response.ok) {
    throw new Error("Could not load products");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`);

  if (!response.ok) {
    throw new Error("Could not load product");
  }

  const product: Product = await response.json();

  return product;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("https://dummyjson.com/products/categories");

  if (!response.ok) {
    throw new Error("Could not load categories");
  }

  const categories: Category[] = await response.json();

  return categories;
}
