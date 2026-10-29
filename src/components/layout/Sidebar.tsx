import { Link, NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/", label: "Home", path: "m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" },
  { to: "/products", label: "Products", path: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
];

const upcomingGroups = [
  [
    { label: "New Arrivals", path: "M12 3v12m-4-4 4 4 4-4M5 15v6h14v-6" },
    { label: "Best Sellers", path: "m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1z" },
    { label: "Brands", path: "m12 3 9 7-9 11-9-11zM3 10h18M8 4l4 17 4-17" },
    { label: "Collections", path: "M7 3h14v14H7zM3 7v14h14" },
  ],
  [
    { label: "My Orders", path: "M6 4h12v17H6zM9 3h6v4H9zM9 11h6M9 15h6" },
    { label: "Wishlist", path: "M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7z" },
    { label: "Coupons", path: "M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM14 6v12" },
    { label: "Addresses", path: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0" },
    { label: "Account Settings", path: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3" },
  ],
];

export function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="hidden rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-20 lg:block lg:self-start lg:p-4">
      <nav aria-label="Store navigation" className="flex flex-wrap gap-2 lg:flex-col">
        {links.map(({ to, label, path }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-slate-600 hover:bg-red-50 hover:text-red-900"}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0"><path d={path}/></svg>
            {label}
          </NavLink>
        ))}
        {user ? <button type="button" onClick={logout} className="min-h-11 rounded-xl px-3 text-left text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-900">Logout</button> : <NavLink to="/login" className={({ isActive }) => `flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-slate-600 hover:bg-red-50"}`}>Login</NavLink>}
      </nav>
      {upcomingGroups.map((group, index) => (
        index === 1 && !user ? null :
        <ul key={index} aria-label={index === 0 ? "Upcoming shopping features" : "Upcoming account features"} className="mt-3 grid gap-1 border-t border-slate-200 pt-3 sm:grid-cols-2 lg:grid-cols-1">
          {group.map(({ label, path }) => (
            <li key={label}>
              <NavLink to={`/${label.toLowerCase().replaceAll(" ", "-")}`} className={({ isActive }) => `flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${isActive ? "bg-red-900 text-white" : "text-slate-600 hover:bg-red-50 hover:text-red-900"}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0"><path d={path}/></svg>
              <span>{label === "Wishlist" ? "My Wishlist" : label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      ))}
      <div className="mt-6 hidden rounded-2xl bg-gradient-to-br from-red-900 to-red-700 p-5 text-white lg:block">
        <p className="text-xs text-red-100">The 10X collection</p>
        <p className="mt-3 text-xl font-semibold">Find your everyday favorites</p>
        <Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-red-900 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Shop now</Link>
      </div>
    </aside>
  );
}
