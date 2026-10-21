import { Link } from "react-router";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="rounded-lg border border-gray-200 p-4"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full object-contain"
      />
      <h2 className="mt-4 text-lg font-semibold">{product.title}</h2>
      <p className="mt-2 text-gray-600">${product.price}</p>
    </Link>
  );
}

export default ProductCard;
