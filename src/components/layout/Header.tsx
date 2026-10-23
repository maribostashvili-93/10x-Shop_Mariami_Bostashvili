import { NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/", label: "Products", end: true },
  { to: "/cart", label: "Cart", end: false },
];

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-stone-200 py-4">
      <NavLink to="/" className="flex min-h-11 items-center gap-3 text-xl font-bold tracking-tight text-stone-900 focus-visible:outline-2 focus-visible:outline-red-900">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-red-900 text-sm text-white">10X</span>
        10X Shop
      </NavLink>
      <nav aria-label="Main navigation" className="flex flex-wrap gap-1 sm:gap-2">
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
      </nav>
    </header>
  );
}

export default Header;
