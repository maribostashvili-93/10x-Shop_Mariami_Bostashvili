import { Cart, findPromoCode } from "../models/Cart";
import type { CartAction, CartState } from "../types/cart";

export const emptyCart: CartState = { items: [], promoCode: null };

export function cartReducer(state: CartState, action: CartAction): CartState {
  const cart = new Cart(state.items);

  switch (action.type) {
    case "add":
      return { ...state, items: [...cart.add(action.product, action.quantity).items] };
    case "setQuantity":
      return { ...state, items: [...cart.setQuantity(action.productId, action.quantity).items] };
    case "remove": {
      const items = [...cart.remove(action.productId).items];
      return { items, promoCode: items.length > 0 ? state.promoCode : null };
    }
    case "clear":
      return emptyCart;
    case "applyPromo": {
      const promo = findPromoCode(action.code);
      return promo ? { ...state, promoCode: promo.code } : state;
    }
    case "removePromo":
      return { ...state, promoCode: null };
    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}
