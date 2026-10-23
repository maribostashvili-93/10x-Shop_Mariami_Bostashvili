import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen bg-[#f7f3f1] px-4 text-stone-900 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col">
        <Header />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="w-full flex-1 py-6 sm:py-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;
