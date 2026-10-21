import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
