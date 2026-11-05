export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  rating: number;
  stock: number;
  price: number;
  discountPercentage?: number;
  thumbnail: string;
  images?: string[];
  reviews?: ProductReview[];
};

/** Shape of DummyJSON list responses such as GET /products?limit=12&skip=0. */
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};
