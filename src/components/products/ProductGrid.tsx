import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

function ProductGrid({ products, className = "" }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-3 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
