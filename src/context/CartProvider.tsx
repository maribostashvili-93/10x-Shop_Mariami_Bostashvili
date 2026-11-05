import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, CartState } from "../types/cart";
import { isProduct } from "../api/products";
import { Cart, findPromoCode } from "../models/Cart";
import { StorageService } from "../services/StorageService";
import { CartContext } from "./cart-context";
import { cartReducer, emptyCart } from "./cartReducer";

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" && value !== null &&
    "product" in value && isProduct(value.product) &&
    "quantity" in value && typeof value.quantity === "number" && Number.isInteger(value.quantity) && value.quantity > 0
  );
}

function isCartState(value: unknown): value is CartState {
  return (
    typeof value === "object" && value !== null &&
    "items" in value && Array.isArray(value.items) && value.items.every(isCartItem) &&
    "promoCode" in value && (value.promoCode === null || typeof value.promoCode === "string")
  );
}

const cartStorage = new StorageService<CartState>("10x-cart", isCartState, emptyCart);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => cartStorage.load());

  // Persist every change; logging out does not touch the cart.
  useEffect(() => {
    cartStorage.save(state);
  }, [state]);

  const promo = state.promoCode ? findPromoCode(state.promoCode) : null;
  const totals = useMemo(() => new Cart(state.items).totals(promo), [state.items, promo]);

  const value = {
    items: state.items,
    promo,
    totals,
    addToCart: (product: Product, quantity: number) => dispatch({ type: "add", product, quantity }),
    removeFromCart: (productId: number) => dispatch({ type: "remove", productId }),
    setQuantity: (productId: number, quantity: number) => dispatch({ type: "setQuantity", productId, quantity }),
    clearCart: () => dispatch({ type: "clear" }),
    applyPromo: (code: string) => {
      if (!findPromoCode(code)) return false;
      dispatch({ type: "applyPromo", code });
      return true;
    },
    removePromo: () => dispatch({ type: "removePromo" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
