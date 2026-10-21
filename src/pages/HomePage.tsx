import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-48 w-full object-contain"
            />
            <h2 className="mt-4 text-lg font-semibold">{product.title}</h2>
            <p className="mt-2 text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomePage;
