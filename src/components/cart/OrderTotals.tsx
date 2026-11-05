import { Cart, findPromoCode } from "../../models/Cart";
import { formatPrice } from "../../utils/formatPrice";

type OrderTotalsProps = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode: string | null;
  /** Shown as a hint in the cart; omit on finished orders. */
  freeShippingRemaining?: number;
  size?: "sm" | "md";
};

/** Subtotal → promo discount → shipping → total, shared by cart, checkout and orders. */
function OrderTotals({ subtotal, discount, shipping, total, promoCode, freeShippingRemaining, size = "md" }: OrderTotalsProps) {
  const promo = promoCode ? findPromoCode(promoCode) : null;
  const text = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={text}>
      <dl className="space-y-3">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-semibold text-slate-900">{formatPrice(subtotal)}</dd>
        </div>
        {promo && (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Discount ({promo.code} −{promo.percent}%)</dt>
            <dd className="font-semibold text-emerald-700">−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Shipping</dt>
          <dd className="font-semibold text-slate-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-lg">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-semibold text-slate-900">{formatPrice(total)}</dd>
        </div>
      </dl>
      {freeShippingRemaining !== undefined && freeShippingRemaining > 0 && (
        <p className="mt-3 text-xs text-slate-600">
          Add {formatPrice(freeShippingRemaining)} more for free shipping (orders from {formatPrice(Cart.FREE_SHIPPING_FROM)}).
        </p>
      )}
    </div>
  );
}

export default OrderTotals;
