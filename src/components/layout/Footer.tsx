import { Link, useNavigate } from "react-router";

const groups = [
  { title: "Explore", links: [{ label: "All products", to: "/products" }, { label: "Bags & accessories", to: "/products?category=womens-bags" }, { label: "Fragrances", to: "/products?category=fragrances" }, { label: "Jewellery", to: "/products?category=womens-jewellery" }] },
  { title: "Your 10X", links: [{ label: "My wishlist", to: "/wishlist" }, { label: "Shopping bag", to: "/cart" }, { label: "My account", to: "/login" }] },
  { title: "The journal", links: [{ label: "Everyday rituals", to: "/journal/the-art-of-slow-days" }, { label: "The style edit", to: "/journal/your-everyday-style-edit" }] },
];

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="mt-10 overflow-hidden rounded-t-3xl border border-violet-100 bg-white">
      <section aria-labelledby="footer-search-heading" className="grid items-center gap-6 bg-violet-950 px-6 py-7 text-white md:grid-cols-2 sm:px-10">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/5"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></svg></span>
          <div><p className="text-[10px] font-semibold tracking-[0.2em] text-violet-200 uppercase">Find your next favorite</p><h2 id="footer-search-heading" className="mt-1 text-xl font-semibold tracking-tight">Thoughtful finds. Everyday joy.</h2><p className="mt-2 text-xs leading-5 text-violet-200">A little inspiration for your style, your space and everything in between.</p></div>
        </div>
        <form role="search" onSubmit={(event) => { event.preventDefault(); const query = String(new FormData(event.currentTarget).get("q") ?? "").trim(); navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products"); }} className="flex min-w-0 items-center gap-2 rounded-2xl bg-white p-1.5">
          <label htmlFor="footer-search" className="sr-only">Search products</label><input id="footer-search" type="search" name="q" placeholder="What are you looking for?" className="min-h-11 min-w-0 flex-1 rounded-xl px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-violet-500" />
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><span className="hidden sm:inline">Search</span><span className="sr-only sm:hidden">Search products</span></button>
        </form>
      </section>
      <div className="grid gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] sm:px-10">
        <div><Link to="/" className="inline-flex min-h-11 items-center gap-2 text-xl font-bold tracking-tight text-violet-950"><span className="flex size-9 items-center justify-center rounded-xl bg-violet-700 text-xs text-white">10X</span>10X Shop</Link><p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">Considered essentials and little discoveries, chosen to make every day feel more like you.</p><Link to="/products" className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-violet-700">Explore the collection <span aria-hidden="true">→</span></Link></div>
        {groups.map((group) => <nav key={group.title} aria-label={`Footer ${group.title}`}><h3 className="text-xs font-semibold tracking-wide text-slate-900">{group.title}</h3><ul className="mt-3 space-y-1">{group.links.map((link) => <li key={link.to}><Link to={link.to} className="inline-flex min-h-11 items-center text-xs text-slate-500 transition-colors hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-700">{link.label}</Link></li>)}</ul></nav>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-violet-100 px-6 py-5 text-[11px] text-slate-500 sm:px-10"><p>© 2026 10X Shop. All rights reserved.</p><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }} className="inline-flex min-h-11 items-center gap-2 font-medium text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-700">Back to top <span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}

export default Footer;
