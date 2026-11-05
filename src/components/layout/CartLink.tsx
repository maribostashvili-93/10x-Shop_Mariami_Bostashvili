import { NavLink } from "react-router";
import { useCart } from "../../hooks/useCart";

type CartLinkProps = {
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
};

/** Header cart link with a live item-count badge from CartContext. */
function CartLink({ showLabel = false, className = "", onClick }: CartLinkProps) {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <NavLink
      to="/cart"
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${isActive ? "bg-violet-700 text-white" : "text-stone-600 hover:bg-violet-50 hover:text-violet-800"} ${className}`
      }
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 3h2l2.5 12h11L21 7H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {/* Accessible name ("Cart 2 items") is built from the visible text so it matches what users see. */}
      <span className={showLabel ? "" : "sr-only"}>Cart</span>
      <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-violet-950 px-1 text-[11px] leading-5 text-white">
        <span className="sr-only">&nbsp;</span>
        {count > 99 ? "99+" : count}
        <span className="sr-only">&nbsp;{count === 1 ? "item" : "items"}</span>
      </span>
    </NavLink>
  );
}

export default CartLink;
