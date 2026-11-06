import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../hooks/useToast";
import { formatDate, getFinalPrice } from "../utils/formatPrice";
import { getProduct, getProductsByCategory } from "../api/products";
import type { Product, ProductReview } from "../types/product";
import ReviewForm from "../components/products/ReviewForm";
import { averageRating, reviewStorage, type LocalReviews } from "../services/reviewStorage";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import OptionPicker from "../components/products/OptionPicker";
import { Cart } from "../models/Cart";
import { colorFilter, defaultOptions } from "../models/productOptions";
import { useJustAdded } from "../hooks/useJustAdded";
import type { ProductOptions } from "../types/cart";
import ProductCard from "../components/products/ProductCard";
import ProductPrice, { StockStatus } from "../components/products/ProductPrice";
import NotFoundPage from "./NotFoundPage";
import SEO, { SITE_URL } from "../components/SEO";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex gap-0.5 text-amber-500" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} aria-hidden="true" viewBox="0 0 24 24" fill={index < rounded ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="size-4">
          <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" />
        </svg>
      ))}
    </span>
  );
}

function ProductPage() {
  const { id } = useParams();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [chosenOptions, setChosenOptions] = useState<ProductOptions | null>(null);
  const [justAdded, markAdded] = useJustAdded();
  const [addedText, setAddedText] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [localReviews, setLocalReviews] = useState<LocalReviews>(() => reviewStorage.load());
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);
  const [trackedId, setTrackedId] = useState(id);

  // Reset per-product UI state during render when the route ID changes (React's recommended pattern).
  if (trackedId !== id) {
    setTrackedId(id);
    setProduct(null);
    setLoading(true);
    setError("");
    setQuantity(1);
    setChosenOptions(null);
    setAddedText("");
    setSelectedImage(0);
    setActiveTab("description");
    setRelatedProducts([]);
  }

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    getProduct(id, controller.signal)
      .then((data) => setProduct(data))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError("Could not load product. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!product) return;
    const controller = new AbortController();
    // Related products: up to four other products from the same category.
    getProductsByCategory(product.category, 5, controller.signal)
      .then((products) => setRelatedProducts(products.filter((item) => item.id !== product.id).slice(0, 4)))
      .catch(() => {
        if (!controller.signal.aborted) setRelatedProducts([]);
      });
    return () => controller.abort();
  }, [product]);

  if (!id) {
    return <NotFoundPage />;
  }

  if (loading) {
    return <p role="status" className="py-10 text-slate-600">Loading product...</p>;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-900">{error}</p>
        <button type="button" onClick={() => { setError(""); setLoading(true); setReloadKey((key) => key + 1); }} className="mt-4 min-h-11 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
          Try again
        </button>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const activeImage = images[Math.min(selectedImage, images.length - 1)];
  const productReviews = localReviews[String(product.id)] ?? [];
  // Newest local reviews first, followed by the reviews from the API.
  const reviews: ProductReview[] = [...productReviews, ...(product.reviews ?? [])];
  const rating = averageRating(reviews, product.rating);

  function addReview({ rating: stars, comment }: { rating: number; comment: string }) {
    if (!product) return;
    const review: ProductReview = { rating: stars, comment, date: new Date().toISOString(), reviewerName: user?.username ?? "Guest" };
    const key = String(product.id);
    const next = { ...localReviews, [key]: [review, ...(localReviews[key] ?? [])] };
    setLocalReviews(next);
    reviewStorage.save(next);
    showToast("Review added ✓");
  }

  function goBack() {
    // Return to the previous catalog view (its filters live in the URL); fall back to the catalog.
    if (location.key !== "default") navigate(-1);
    else navigate("/products");
  }
  // Stock is shared by every colour/size line of this product.
  const available = Math.max(0, product.stock - new Cart(items).quantityOf(product.id));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: { "@type": "Offer", priceCurrency: "USD", price: getFinalPrice(product).toFixed(2), availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE_URL}/products/${product.id}` },
    aggregateRating: { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: Math.max(1, reviews.length) },
  };
  const options = chosenOptions ?? defaultOptions(product);

  function handleAddToCart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || available < 1) return;
    const added = Math.min(quantity, available);
    addToCart(product, added, options);
    setAddedText(`${added} × ${options.color} · ${options.size} added to cart`);
    markAdded();
    setQuantity(1);
  }

  return (
    <div className="pb-10 sm:pb-16">
      <SEO title={product.title} description={product.description.slice(0, 155)} path={`/products/${product.id}`} structuredData={structuredData} />
      <button type="button" onClick={goBack} className="inline-flex min-h-11 items-center text-sm font-medium text-stone-600 transition hover:text-violet-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700">
        <span aria-hidden="true" className="mr-1">←</span> Back to catalog
      </button>

      <div className="mt-8 grid gap-8 overflow-hidden rounded-[2rem] border border-violet-100 bg-white p-4 shadow-[0_18px_50px_rgba(76,29,149,0.08)] sm:p-6 md:grid-cols-2 md:gap-8 md:p-6 lg:gap-10">
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] product-stage bg-gradient-to-br from-violet-50 to-violet-200 p-8 sm:p-12">
            <img
              src={activeImage}
              alt={`${product.title}, ${options.color}`}
              style={{ filter: colorFilter(options.color), transition: "filter 200ms ease" }}
              width={600}
              height={600}
              className="relative h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(45,20,80,0.25)]"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={selectedImage === index}
                  className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border product-stage bg-violet-50 p-1 transition hover:border-violet-500 focus-visible:outline-2 focus-visible:outline-violet-700 ${selectedImage === index ? "border-violet-700 ring-2 ring-violet-200" : "border-violet-100"}`}
                >
                  <img src={image} alt="" loading="lazy" width={120} height={120} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center py-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-700 uppercase">
            {product.brand && <span>{product.brand} · </span>}
            <Link to={`/products?category=${product.category}`} className="hover:underline focus-visible:outline-2 focus-visible:outline-violet-700">{product.category.replaceAll("-", " ")}</Link>
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>
          <p className="mt-3 flex items-center gap-1 text-sm text-stone-600">
            <span aria-hidden="true" className="text-amber-500">★</span>
            <span><span className="sr-only">Rating </span>{rating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
          </p>
          <div className="mt-4"><ProductPrice product={product} size="lg" /></div>
          <div className="mt-3"><StockStatus stock={product.stock} /></div>
          <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200 text-sm">
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-600">Category</dt><dd className="font-medium text-stone-900">{product.category}</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-600">Rating</dt><dd className="font-medium text-stone-900">{rating.toFixed(2)} / 5</dd></div>
            <div className="flex justify-between gap-4 py-4"><dt className="text-stone-600">Availability</dt><dd className="font-medium text-stone-900">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd></div>
          </dl>
          <form className="mt-6 space-y-4" onSubmit={handleAddToCart}>
            <OptionPicker product={product} value={options} onChange={setChosenOptions} idPrefix={`product-${product.id}`} />
            <p id="quantity-label" className="block text-sm font-medium text-slate-900">Quantity</p>
            <div className="flex flex-wrap gap-3">
              <div role="group" aria-labelledby="quantity-label" className="flex items-center rounded-lg border border-slate-300">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || available < 1} aria-label="Decrease quantity" className="flex size-11 items-center justify-center text-lg hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-40">−</button>
                <output aria-live="polite" className="min-w-10 text-center font-semibold text-slate-900">{available < 1 ? 0 : quantity}</output>
                <button type="button" onClick={() => setQuantity((value) => Math.min(available, value + 1))} disabled={quantity >= available} aria-label="Increase quantity" className="flex size-11 items-center justify-center text-lg hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-40">+</button>
              </div>
              <button
                type="submit"
                disabled={available < 1}
                className={`min-h-11 rounded-lg px-6 font-semibold text-white transition-colors ${justAdded ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-700 hover:bg-violet-800"} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {product.stock === 0 ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
              </button>
            </div>
            {product.stock > 0 && available < 1 && <p role="status" className="text-sm text-slate-600">You already have all {product.stock} available in your cart.</p>}
            <p role="status" className="text-sm text-emerald-700">{justAdded ? addedText : ""}</p>
          </form>
        </div>
      </div>

      <section className="mx-auto mt-12 max-w-5xl rounded-[1.5rem] bg-white p-5 shadow-[0_10px_30px_rgba(67,36,30,0.05)] sm:p-8">
        <div role="tablist" aria-label="Product information" className="flex gap-2 border-b border-stone-200">
          {(["description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  const next = tab === "description" ? "reviews" : "description";
                  setActiveTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
              className={`-mb-px min-h-11 border-b-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-violet-700 ${activeTab === tab ? "border-violet-700 text-violet-800" : "border-transparent text-stone-600 hover:text-violet-800"}`}
            >
              {tab === "description" ? "Description" : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        <div role="tabpanel" id="panel-description" aria-labelledby="tab-description" hidden={activeTab !== "description"} className="pt-6">
          <p className="leading-7 text-stone-600">{product.description}</p>
        </div>

        <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" hidden={activeTab !== "reviews"} className="pt-6">
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-stone-900">{rating.toFixed(1)}</p>
            <div>
              <Stars rating={rating} />
              <p className="mt-1 text-xs text-stone-600">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
            </div>
          </div>
        {reviews.length === 0 ? (
          <p className="mt-6 text-sm text-stone-600">There are no reviews for this product yet.</p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <li key={`${review.reviewerName}-${review.date}-${review.comment.slice(0, 12)}`} className="border-b border-stone-100 pb-5">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">
                    {review.reviewerName.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{review.reviewerName}</p>
                    <p className="text-xs text-stone-600">{formatDate(review.date)}</p>
                  </div>
                </div>
                <div className="mt-3"><Stars rating={review.rating} /></div>
                <p className="mt-2 text-sm leading-6 text-stone-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
          <ReviewForm onSubmit={addReview} />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-12 rounded-[2rem] bg-violet-50 p-5 sm:p-8" aria-labelledby="related-products">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">You may also like</p><h2 id="related-products" className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Shop similar pieces</h2></div>
            <Link to={`/products?category=${product.category}`} className="hidden min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-900 sm:inline-flex">View all</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;
