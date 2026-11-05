import { lazy } from "react";
import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// Route-level code splitting: each page is downloaded only when it is first visited.
// The home page stays in the main bundle because it is the landing route.
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/journal/:slug" element={<JournalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
