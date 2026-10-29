import { NavLink } from "react-router";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingPanels } from "./ShoppingPanels";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products", end: false },
];

function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-stone-200 bg-[#f7f3f1]/95 py-3 backdrop-blur sm:py-4">
      <NavLink to="/" className="flex min-h-11 items-center gap-3 text-xl font-bold tracking-tight text-stone-900 focus-visible:outline-2 focus-visible:outline-red-900">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-red-900 text-sm text-white">10X</span>
        10X Shop
      </NavLink>
      <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)} className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-900 focus-visible:outline-2 focus-visible:outline-red-900 lg:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5"><path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
      </button>
      {menuOpen && <nav id="mobile-menu" aria-label="Mobile menu" className="order-3 grid basis-full gap-1 border-t border-stone-200 pt-2 lg:hidden">
        <NavLink to="/products" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-red-900">Shop all products</NavLink>
        <NavLink to="/wishlist" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-red-900">My wishlist</NavLink>
        {user ? <button type="button" onClick={() => { logout(); setMenuOpen(false); }} className="min-h-11 rounded-xl px-3 text-left text-sm font-semibold text-red-900 focus-visible:outline-2 focus-visible:outline-red-900">Logout</button> : <NavLink to="/login" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-red-900 focus-visible:outline-2 focus-visible:outline-red-900">Login</NavLink>}
      </nav>}
      <nav aria-label="Main navigation" className="hidden flex-wrap gap-1 sm:gap-2 lg:flex">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-stone-600 hover:bg-red-50 hover:text-red-900"}`}>
            {label}
          </NavLink>
        ))}
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-900 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-stone-600 hover:bg-red-50 hover:text-red-900"}`}
          >
            Login
          </NavLink>
        )}
        <ShoppingPanels />
      </nav>
    </header>
  );
}

export default Header;
