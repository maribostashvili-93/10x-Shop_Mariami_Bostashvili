import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { Sidebar } from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-[#f7f3f1] px-4 text-stone-900 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col">
        <Header />
        <div className="grid min-w-0 flex-1 gap-6 py-6 lg:grid-cols-[210px_minmax(0,1fr)]">
          <Sidebar />
          <main className="min-w-0 w-full">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
