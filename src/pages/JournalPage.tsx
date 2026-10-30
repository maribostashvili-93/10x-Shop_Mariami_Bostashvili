import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { stories } from "../data/journal";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import ProductCard from "../components/products/ProductCard";
import NotFoundPage from "./NotFoundPage";

export default function JournalPage() {
  const { slug } = useParams();
  const story = stories.find((item) => item.slug === slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getProducts(true).then((data) => { if (active) setProducts(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (!story) return <NotFoundPage />;
  const related = story.categories.flatMap((category) => products.filter((product) => product.category === category).slice(0, 2)).slice(0, 6);
  return <article>
    <Link to="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700">← Back to home</Link>
    <header className="mx-auto max-w-2xl py-6 text-center sm:py-10"><p className="text-xs font-semibold tracking-widest text-violet-700 uppercase">{story.label} · 2 min read</p><h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{story.title}</h1><p className="mt-4 text-base leading-7 text-slate-500">{story.intro}</p></header>
    <img src={story.image} alt={story.alt} className="aspect-[16/9] w-full rounded-3xl object-cover" />
    <div className="mx-auto max-w-2xl space-y-5 py-8 sm:py-12">{story.paragraphs.map((paragraph) => <p key={paragraph} className="text-base leading-8 text-slate-600">{paragraph}</p>)}</div>
    <section aria-labelledby="shop-story-heading" className="border-t border-violet-100 pt-8">
      <p className="text-[10px] font-semibold tracking-widest text-violet-700 uppercase">Inspired by this story</p><h2 id="shop-story-heading" className="mt-2 text-2xl font-semibold text-slate-900">Shop the edit</h2>
      {loading ? <p role="status" className="mt-5">Loading the collection…</p> : error ? <p role="alert" className="mt-5 text-slate-600">Products could not load. <Link to="/products" className="text-violet-700 underline">Browse the shop</Link></p> : related.length ? <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-3">{related.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="mt-5 text-slate-500">This collection is currently unavailable.</p>}
    </section>
  </article>;
}
