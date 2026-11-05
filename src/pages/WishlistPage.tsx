import { Link } from "react-router";
import { useWishlist } from "../hooks/useWishlist";
import ProductCard from "../components/products/ProductCard";

export default function WishlistPage() {
  const { products } = useWishlist();
  return (
    <section>
      <h1 className="text-3xl font-semibold text-slate-900">My Wishlist</h1>
      {products.length ? (
        <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-6">
          <p className="text-slate-600">Your wishlist is empty. Save products using the heart button.</p>
          <Link to="/products" className="mt-4 inline-flex min-h-11 items-center font-semibold text-red-900 underline">Browse products</Link>
        </div>
      )}
    </section>
  );
}
