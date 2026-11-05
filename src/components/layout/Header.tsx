import { NavLink } from "react-router";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useLogout";
import { ShoppingPanels } from "./ShoppingPanels";
import CartLink from "./CartLink";
import ThemeToggle from "../ui/ThemeToggle";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${isActive ? "bg-violet-700 text-white" : "text-stone-600 hover:bg-violet-50 hover:text-violet-800"}`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-violet-700 ${isActive ? "bg-violet-100 text-violet-800" : "text-slate-700"}`;

function Header() {
  const { user, profile } = useAuth();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = profile.firstName || user?.username || "";
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-[#fcfaff]/95 backdrop-blur dark:bg-[#0f0d17]/95">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 sm:py-4">
        <NavLink to="/" className="flex min-h-11 items-center gap-3 text-xl font-bold tracking-tight text-stone-900 focus-visible:outline-2 focus-visible:outline-violet-700">
          <span aria-hidden="true" className="keep-light flex size-9 items-center justify-center rounded-xl bg-violet-700 text-sm text-white">10X</span>
          10X Shop
        </NavLink>

        <div className="flex items-center gap-2 lg:hidden">
          <CartLink />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-violet-800 focus-visible:outline-2 focus-visible:outline-violet-700"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5"><path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile menu" className="order-3 grid basis-full gap-1 border-t border-stone-200 pt-2 lg:hidden">
            <NavLink to="/" end onClick={closeMenu} className={mobileLinkClass}>Home</NavLink>
            <NavLink to="/products" onClick={closeMenu} className={mobileLinkClass}>Catalog</NavLink>
            <NavLink to="/cart" onClick={closeMenu} className={mobileLinkClass}>Cart</NavLink>
            <NavLink to="/wishlist" onClick={closeMenu} className={mobileLinkClass}>Wishlist</NavLink>
            {user && <NavLink to="/orders" onClick={closeMenu} className={mobileLinkClass}>Orders</NavLink>}
            {user
              ? <NavLink to="/profile" onClick={closeMenu} className={mobileLinkClass}>Profile ({displayName})</NavLink>
              : <NavLink to="/login" onClick={closeMenu} className={mobileLinkClass}>Log in</NavLink>}
            <div className="px-3 py-1"><ThemeToggle showLabel /></div>
            {user && (
              <button type="button" onClick={() => { closeMenu(); logout(); }} className="min-h-11 rounded-xl px-3 text-left text-sm font-semibold text-violet-800 focus-visible:outline-2 focus-visible:outline-violet-700">
                Log out
              </button>
            )}
          </nav>
        )}

        <nav aria-label="Main navigation" className="hidden flex-wrap items-center gap-1 sm:gap-2 lg:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Catalog</NavLink>
          <CartLink showLabel />
          {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
          {user
            ? <NavLink to="/profile" className={linkClass}>{displayName}</NavLink>
            : <NavLink to="/login" className={linkClass}>Log in</NavLink>}
          <ThemeToggle />
          {user && (
            <button type="button" onClick={logout} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
              Log out
            </button>
          )}
          <ShoppingPanels />
        </nav>
      </div>
    </header>
  );
}

export default Header;
