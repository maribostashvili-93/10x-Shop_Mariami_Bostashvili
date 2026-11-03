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
  const [accountOpen, setAccountOpen] = useState(false);
  const accountLinks = ["My Orders", "My Wishlist", "Coupons", "Addresses", "Account Settings"];

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-[#fcfaff]/95 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 sm:py-4">
      <NavLink to="/" className="flex min-h-11 items-center gap-3 text-xl font-bold tracking-tight text-stone-900 focus-visible:outline-2 focus-visible:outline-red-900">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-violet-700 text-sm text-white">10X</span>
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
          <div className="relative">
            <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-haspopup="menu" className="flex min-h-11 items-center gap-2 rounded-lg bg-violet-50 px-3 text-sm font-semibold text-violet-800 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700"><span className="flex size-7 items-center justify-center rounded-full bg-violet-700 text-xs text-white">{user.username.charAt(0).toUpperCase()}</span>{user.username}<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><path d="m6 9 6 6 6-6" /></svg></button>
            {accountOpen && <nav aria-label="Account menu" role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-violet-100 bg-white p-2 shadow-xl"><NavLink to="/profile" onClick={() => setAccountOpen(false)} role="menuitem" className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-violet-800 hover:bg-violet-50">My profile</NavLink>{accountLinks.map((label) => <NavLink key={label} to={`/${label.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setAccountOpen(false)} role="menuitem" className="flex min-h-10 items-center rounded-lg px-3 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-800">{label}</NavLink>)}</nav>}
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-stone-600 hover:bg-red-50 hover:text-red-900"}`}
          >
            Login
          </NavLink>
        )}
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-900 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            Logout
          </button>
        ) : null}
        <ShoppingPanels />
      </nav>
      </div>
    </header>
  );
}

export default Header;
