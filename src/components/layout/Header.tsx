import { Link } from "react-router";

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/" className="text-xl font-bold">
          10X Shop
        </Link>

        <nav className="flex gap-6" aria-label="Main navigation">
          <Link to="/">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
