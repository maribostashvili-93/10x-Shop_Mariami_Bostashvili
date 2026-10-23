import { Link } from "react-router";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(68,35,35,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(68,35,35,0.1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f6f1ef] p-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">{product.category}</p>
        <h2 className="mt-2 text-base leading-snug font-semibold text-stone-900">{product.title}</h2>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-stone-600">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-amber-600"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" /></svg>
          <span>Rating: {product.rating} / 5</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <p className="text-lg font-semibold text-stone-950">${product.price.toFixed(2)}</p>
          <span className="text-sm font-medium text-red-800 group-hover:text-red-950">View details</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
