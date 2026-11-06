import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { getCatalogProducts } from "../../api/products";
import { getFinalPrice } from "../../utils/formatPrice";
import type { Product } from "../../types/product";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  products?: Product[];
};

const starterMessage: Message = {
  id: 1,
  from: "bot",
  text: "Hi! I can help you find products, deals and shopping pages.",
};

function ShopAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [products, setProducts] = useState<Product[]>([]);
  const nextId = useRef(2);

  useEffect(() => {
    if (!open || products.length) return;
    let active = true;
    getCatalogProducts(0)
      .then((items) => { if (active) setProducts(items); })
      .catch(() => { if (active) setProducts([]); });
    return () => { active = false; };
  }, [open, products.length]);

  const popularDeals = useMemo(() => products.filter((item) => (item.discountPercentage ?? 0) >= 15).slice(0, 3), [products]);

  function respond(raw: string) {
    const query = raw.trim();
    if (!query) return;
    const lower = query.toLowerCase();
    const matching = products.filter((product) => `${product.title} ${product.category} ${product.brand ?? ""}`.toLowerCase().includes(lower)).slice(0, 3);
    let text = "Try asking for a product, a category, deals, or help with your cart.";
    let recommendations: Product[] | undefined;
    if (matching.length) {
      text = `I found ${matching.length} product${matching.length > 1 ? "s" : ""} that may match your search.`;
      recommendations = matching;
    } else if (lower.includes("deal") || lower.includes("discount") || lower.includes("sale")) {
      text = popularDeals.length ? "Here are a few discounted products from the current catalog." : "Open Best deals to see the latest discounts.";
      recommendations = popularDeals.length ? popularDeals : undefined;
    } else if (lower.includes("cart") || lower.includes("checkout")) {
      text = "Your cart and checkout are available from the navigation. Checkout requires signing in first.";
    } else if (lower.includes("category") || lower.includes("catalog") || lower.includes("shop")) {
      text = "You can browse the full catalog, search products and filter by category.";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      text = "Hello! What would you like to shop for today?";
    }
    setMessages((current) => [
      ...current,
      { id: nextId.current++, from: "user", text: query },
      { id: nextId.current++, from: "bot", text, products: recommendations },
    ]);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-4 z-40 sm:right-6">
      {open && (
        <section aria-label="Shop assistant" className="mb-3 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-2xl dark:border-violet-800 dark:bg-[#1a1526]">
          <header className="flex items-center justify-between bg-violet-700 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">10X Shop Assistant</p>
              <p className="text-xs text-violet-100">Product help, locally powered</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close shop assistant" className="rounded-lg p-2 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white">
              <span aria-hidden="true" className="text-lg leading-none">×</span>
            </button>
          </header>
          <div className="max-h-80 space-y-3 overflow-y-auto p-3" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={message.from === "user" ? "ml-8" : "mr-4"}>
                <p className={`rounded-xl px-3 py-2 text-sm ${message.from === "user" ? "bg-violet-700 text-white" : "bg-violet-50 text-slate-700 dark:bg-violet-950/70 dark:text-violet-100"}`}>{message.text}</p>
                {message.products?.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-lg border border-violet-100 p-2 text-xs hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-950/60">
                    <img src={product.thumbnail} alt="" className="size-9 rounded-md object-contain" />
                    <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-violet-100">{product.title}</span>
                    <span className="font-semibold text-violet-700 dark:text-violet-300">${getFinalPrice(product).toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            ))}
            {open && !products.length && <p role="status" className="text-xs text-slate-500">Loading product suggestions…</p>}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); respond(input); }} className="flex gap-2 border-t border-violet-100 p-3 dark:border-violet-900">
            <label htmlFor="shop-assistant-input" className="sr-only">Ask the shop assistant</label>
            <input id="shop-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Search products or ask…" className="min-w-0 flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-violet-700 dark:bg-[#241c35] dark:text-white" />
            <button type="submit" className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-violet-700">Send</button>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close shop assistant" : "Open shop assistant"} className="ml-auto flex size-14 items-center justify-center rounded-full bg-violet-700 text-white shadow-xl ring-4 ring-white/70 transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 dark:ring-[#0f0d17]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 18.5 4 21v-4.5A7.5 7.5 0 0 1 3 13V8.5A4.5 4.5 0 0 1 7.5 4h9A4.5 4.5 0 0 1 21 8.5v5A4.5 4.5 0 0 1 16.5 18H9.5L7 18.5Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

export default ShopAssistant;
