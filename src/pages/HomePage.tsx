import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCatalogProducts } from "../api/products";
import type { Product } from "../types/product";
import ProductCard from "../components/products/ProductCard";
import HeroCarousel from "../components/products/HeroCarousel";
import CatalogSearchBar from "../components/products/CatalogSearchBar";
import CollectionShowcase from "../components/products/CollectionShowcase";
import JournalCards from "../components/products/JournalCards";
import CommunityStories from "../components/products/CommunityStories";
import { FeatureStrip, ProductRail, ShopByCategory, TopBrands } from "../components/products/HomeSections";

const PREVIEW_COUNT = 6;

/** A preview of the catalog: the first six products and a link to the full list. */
function CatalogPreview() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getCatalogProducts(PREVIEW_COUNT, 0, controller.signal)
      .then(setProducts)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  return (
    <section className="mt-10" aria-labelledby="catalog-preview-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-violet-700 uppercase">Catalog</p>
          <h2 id="catalog-preview-heading" className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">All products</h2>
        </div>
        <Link to="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-950">View all <span aria-hidden="true" className="ml-1">→</span></Link>
      </div>

      {failed ? (
        <p role="alert" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">Could not load products. Open the catalog to try again.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-3">
          {products
            ? products.map((product) => <ProductCard key={product.id} product={product} />)
            : Array.from({ length: PREVIEW_COUNT }, (_, index) => <div key={index} aria-hidden="true" className="aspect-[3/4] animate-pulse rounded-2xl bg-violet-50" />)}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link to="/products" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-6 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
          View all products <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="storefront-home">
      <HeroCarousel />
      <FeatureStrip />
      <section className="mt-8" aria-label="Find products">
        <CatalogSearchBar params={{ q: "", category: "", sort: "" }} />
        <CollectionShowcase />
      </section>
      <ShopByCategory />
      <CatalogPreview />
      <ProductRail title="New arrivals" eyebrow="Just in" sortBy="id" viewAllTo="/products" />
      <ProductRail title="Best sellers" eyebrow="Most wanted" sortBy="rating" viewAllTo="/products?sort=rating-desc" />
      <ProductRail title="Sale edit" eyebrow="Limited offers" sortBy="discountPercentage" viewAllTo="/products" />
      <JournalCards />
      <TopBrands />
      <CommunityStories />
    </div>
  );
}

export default HomePage;
