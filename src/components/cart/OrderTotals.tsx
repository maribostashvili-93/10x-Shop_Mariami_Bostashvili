import { formatPrice } from "../../utils/formatPrice";

type OrderTotalsProps = {
  subtotal: number;
  discount: number;
  promoDiscount: number;
  total: number;
  promoCode: string | null;
  size?: "sm" | "md";
};

/** Subtotal → product discounts → promo → total, shared by cart, checkout and orders. */
function OrderTotals({ subtotal, discount, promoDiscount, total, promoCode, size = "md" }: OrderTotalsProps) {
  const text = size === "sm" ? "text-sm" : "text-base";
  return (
    <dl className={`space-y-3 ${text}`}>
      <div className="flex justify-between gap-4">
        <dt className="text-slate-600">Subtotal</dt>
        <dd className="font-semibold text-slate-900">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-slate-600">Discount</dt>
        <dd className="font-semibold text-brand-700">−{formatPrice(discount)}</dd>
      </div>
      {promoCode && (
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Promo {promoCode}</dt>
          <dd className="font-semibold text-brand-700">−{formatPrice(promoDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-lg">
        <dt className="font-semibold text-slate-900">Total</dt>
        <dd className="font-semibold text-slate-900">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

export default OrderTotals;
