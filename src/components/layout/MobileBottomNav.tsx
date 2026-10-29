import { NavLink } from "react-router";
import { useCart } from "../../hooks/useCart";

const links = [
  { to: "/", label: "Home", path: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" },
  { to: "/products", label: "Shop", path: "M6 7h12l1 14H5L6 7Zm3 0a3 3 0 0 1 6 0" },
  { to: "/wishlist", label: "Wishlist", path: "M12 21 3.7 12.7a5.3 5.3 0 0 1 7.5-7.5L12 6l.8-.8a5.3 5.3 0 0 1 7.5 7.5L12 21Z" },
  { to: "/cart", label: "Cart", path: "M4 5h2l1.2 10.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 1.9-1.5L20 8H7M10 21h.01M17 21h.01" },
  { to: "/login", label: "Account", path: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" },
];

function MobileBottomNav() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav aria-label="Mobile primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {links.map(({ to, label, path }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-50 text-red-900" : "text-slate-500"}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d={path} /></svg>
            <span>{label}</span>
            {label === "Cart" && itemCount > 0 && <span aria-label={`${itemCount} items in cart`} className="absolute right-2 top-1 flex size-4 items-center justify-center rounded-full bg-red-900 text-[10px] text-white">{itemCount > 9 ? "9+" : itemCount}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
