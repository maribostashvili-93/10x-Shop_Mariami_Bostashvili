import { Outlet, useLocation } from "react-router";
import { Suspense, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { Sidebar } from "./Sidebar";
import ShopAssistant from "../chat/ShopAssistant";
import SEO from "../SEO";

function Layout() {
  const { pathname, search } = useLocation();
  const noIndex = ["/cart", "/checkout", "/login", "/orders", "/profile", "/wishlist"].some((path) => pathname.startsWith(path));
  const meta = pathname === "/"
    ? { title: "Modern everyday shopping", description: "Discover thoughtful beauty, fashion, home and lifestyle finds at 10X Shop." }
    : pathname === "/products"
      ? { title: "Shop products", description: "Browse products across beauty, fashion, home and everyday essentials." }
      : pathname.startsWith("/journal/")
        ? { title: "Shopping inspiration", description: "Explore 10X Shop stories, style edits and everyday inspiration." }
        : { title: "Online shop", description: "Shop thoughtful everyday products at 10X Shop." };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);
  return (
    <div className="app-shell min-h-screen bg-[#fcfaff] dark:bg-[#0f0d17] px-3 pb-24 text-stone-900 sm:px-6 lg:pb-0">
      <SEO title={meta.title} description={meta.description} path={pathname} noIndex={noIndex} />
      <div className="mx-auto flex max-w-[1440px] flex-col">
        <Header />
        <div className="grid min-w-0 flex-1 gap-6 py-4 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-6">
          <Sidebar />
          <main className="min-h-[100dvh] min-w-0 w-full">
            <Suspense fallback={<p role="status" className="py-10 text-slate-600">Loading page...</p>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
        <Footer />
        <MobileBottomNav />
        <ShopAssistant />
      </div>
    </div>
  );
}

export default Layout;
