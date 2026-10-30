import { Outlet, useLocation } from "react-router";
import ShopSearch from "../products/ShopSearch";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { Sidebar } from "./Sidebar";

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-[#f7f3f1] px-3 pb-24 text-stone-900 sm:px-6 lg:pb-0">
      <div className="mx-auto flex max-w-[1440px] flex-col">
        <Header />
        <div className="grid min-w-0 flex-1 gap-6 py-4 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-6">
          <Sidebar />
          <main className="min-w-0 w-full">
            {pathname === "/products" && <ShopSearch />}
            <Outlet />
          </main>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default Layout;
