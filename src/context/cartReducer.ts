import { Cart, findPromoCode } from "../models/Cart";
import type { CartAction, CartState } from "../types/cart";

export const emptyCart: CartState = { items: [], promoCode: null };

/** Pure reducer: no localStorage here; CartProvider persists the result. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  const cart = new Cart(state.items, state.promoCode);

  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...cart.add(action.product, action.qty, action.options).items] };
    case "SET_QTY":
      return { ...state, items: [...cart.setQuantity(action.lineId, action.qty).items] };
    case "REMOVE_ITEM": {
      const items = [...cart.remove(action.lineId).items];
      return { items, promoCode: items.length > 0 ? state.promoCode : null };
    }
    case "CLEAR":
      return emptyCart;
    case "APPLY_PROMO": {
      const promo = findPromoCode(action.code);
      return promo ? { ...state, promoCode: promo.code } : state;
    }
    case "REMOVE_PROMO":
      return { ...state, promoCode: null };
    default: {
      // If a new action type is added but not handled, this line stops compiling.
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
