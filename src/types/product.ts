export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
  price: number;
  thumbnail: string;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};
