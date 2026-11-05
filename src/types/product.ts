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
  rating: number;
  stock: number;
  price: number;
  discountPercentage?: number;
  thumbnail: string;
  images?: string[];
  reviews?: ProductReview[];
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};
