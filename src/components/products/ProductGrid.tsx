import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

function ProductGrid({ products, className = "" }: ProductGridProps) {
  return (
    // Mobile ≤480px: 1 column · Tablet 481–1024px: 2–3 columns · Desktop ≥1024px (lg): 4 columns
    <div className={`grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
