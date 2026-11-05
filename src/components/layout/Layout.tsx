import { Outlet, useLocation } from "react-router";
import { Suspense, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { Sidebar } from "./Sidebar";

function Layout() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);
  return (
    <div className="app-shell min-h-screen bg-[#fcfaff] dark:bg-[#0f0d17] px-3 pb-24 text-stone-900 sm:px-6 lg:pb-0">
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
      </div>
    </div>
  );
}

export default Layout;
