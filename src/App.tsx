import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import Layout from "./components/layout/Layout";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";

// Route-level code splitting. The main shopping path (catalog, product, cart) stays in
// the entry bundle: Lighthouse showed that lazy-loading those pages added a chunk
// round trip before LCP and a layout shift. Less frequent or heavier pages are split
// out; Login alone carries Formik + Yup (~80 kB) and is only downloaded when needed.
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));

/** Older links such as /products?category=fragrances now open the catalog on /. */
function LegacyProductsRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/${search}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products" element={<LegacyProductsRedirect />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/journal/:slug" element={<JournalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
