import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import JournalPage from "./pages/JournalPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/journal/:slug" element={<JournalPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        {["New Arrivals", "Best Sellers", "Brands", "Collections", "My Orders", "Coupons", "Addresses", "Account Settings"].map((title) => (
          <Route key={title} path={`/${title.toLowerCase().replaceAll(" ", "-")}`} element={<ComingSoonPage title={title} />} />
        ))}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
