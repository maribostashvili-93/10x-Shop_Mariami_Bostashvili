import type { Product } from "../../types/product";
import { formatPrice, getFinalPrice, hasDiscount } from "../../utils/formatPrice";

type ProductPriceProps = {
  product: Pick<Product, "price" | "discountPercentage">;
  size?: "sm" | "lg";
};

function ProductPrice({ product, size = "sm" }: ProductPriceProps) {
  const finalPrice = getFinalPrice(product);
  const discounted = hasDiscount(product);
  const priceClass = size === "lg" ? "text-3xl" : "text-lg";

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`${priceClass} font-semibold text-violet-700`}>
        {discounted && <span className="sr-only">Sale price </span>}
        {formatPrice(finalPrice)}
      </span>
      {discounted && (
        <>
          <span className="text-sm text-slate-500 line-through">
            <span className="sr-only">Original price </span>
            {formatPrice(product.price)}
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            −{Math.round(product.discountPercentage ?? 0)}%
          </span>
        </>
      )}
    </p>
  );
}

/** In stock (> 5), "Only N left!" (1–5, orange) or "Out of stock" (0, red). */
export function StockStatus({ stock }: { stock: number }) {
  const label = stock === 0 ? "Out of stock" : stock <= 5 ? `Only ${stock} left!` : "In stock";
  const tone = stock === 0 ? "bg-rose-50 text-rose-700" : stock <= 5 ? "bg-orange-50 text-orange-800" : "bg-emerald-50 text-emerald-800";

  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{label}</span>;
}

export default ProductPrice;
