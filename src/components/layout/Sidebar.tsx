import { Link, NavLink, useLocation, useSearchParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useLogout";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/products";
import type { Category } from "../../types/product";

const links = [
  { to: "/", label: "Home", path: "m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" },
  { to: "/products", label: "Catalog", path: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { to: "/products?deals=1", label: "Best deals", path: "M20 12 12 20 4 12V4h8l8 8ZM8 8h.01" },
];

const accountLinks = [
  { to: "/profile", label: "My Profile", path: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3" },
  { to: "/orders", label: "My Orders", path: "M6 4h12v17H6zM9 3h6v4H9zM9 11h6M9 15h6" },
  { to: "/wishlist", label: "My Wishlist", path: "M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7z" },
];

export function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");
  const logout = useLogout();
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);
  return (
    <aside className="hidden rounded-[1.5rem] border border-purple-100 bg-white p-3 shadow-[0_10px_30px_rgba(98,61,140,0.06)] lg:sticky lg:top-20 lg:block lg:self-start lg:p-4">
      <nav aria-label="Store navigation" className="flex flex-wrap gap-2 lg:flex-col">
        {links.map(({ to, label, path }) => {
          // Catalog and Best deals share /products, so the ?deals= query decides which is active.
          const isDeals = to.includes("deals=1");
          const isActive = to === "/" ? pathname === "/" : pathname === "/products" && (searchParams.get("deals") === "1") === isDeals;
          return (
            <Link key={to} to={to} aria-current={isActive ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-slate-600 hover:bg-red-50 hover:text-red-900"}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0"><path d={path}/></svg>
              {label}
            </Link>
          );
        })}
        {user ? <button type="button" onClick={logout} className="min-h-11 rounded-xl px-3 text-left text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-900">Log out</button> : <NavLink to="/login" className={({ isActive }) => `flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-slate-600 hover:bg-red-50"}`}>Log in</NavLink>}
      </nav>
      {user && <ul aria-label="Account navigation" className="mt-3 grid gap-1 border-t border-slate-200 pt-3">{accountLinks.map(({ to, label, path }) => <li key={to}><NavLink to={to} className={({ isActive }) => `flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${isActive ? "bg-violet-100 text-violet-800" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0"><path d={path}/></svg><span>{label}</span></NavLink></li>)}</ul>}
      <div className="mt-5 border-t border-purple-100 pt-4">
        <p className="px-3 text-[11px] font-bold tracking-[0.16em] text-purple-700 uppercase">Shop by category</p>
        <nav aria-label="Product categories" className="mt-2 grid gap-1">
          {categories.slice(0, 9).map((category) => {
            // NavLink only compares the path, so the selected category is read from ?category=.
            const selected = pathname === "/products" && activeCategory === category.slug;
            return <Link key={category.slug} to={`/products?category=${category.slug}`} aria-current={selected ? "page" : undefined} className={`flex min-h-10 items-center rounded-xl px-3 text-sm font-medium transition ${selected ? "bg-purple-100 text-purple-800" : "text-slate-600 hover:bg-pink-50 hover:text-purple-800"}`}>{category.name}</Link>;
          })}
        </nav>
      </div>
      <div className="keep-light mt-6 hidden rounded-2xl bg-gradient-to-br from-[#21134f] via-[#6036a8] to-[#e06aa8] p-5 text-white lg:block">
        <p className="text-xs text-white">The 10X collection</p>
        <p className="mt-3 text-xl font-semibold">Find your everyday favorites</p>
        <Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Shop now</Link>
      </div>
    </aside>
  );
}
