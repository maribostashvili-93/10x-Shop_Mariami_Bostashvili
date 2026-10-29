import { useRef, useState } from "react";
import { Link } from "react-router";
import type { Product } from "../../types/product";
import vegetables from "../../assets/fresh-vegetables.jpg";

export default function EditorialSlider({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const stories = [
    { product: products.find((item) => item.category === "groceries" && /pepper|vegetable|cucumber/i.test(item.title)) ?? products.find((item) => item.category === "groceries"), title: "Fresh finds. Everyday goodness.", label: "The fresh edit", image: vegetables },
    { product: products.find((item) => item.category === "furniture"), title: "A little comfort. A lot of character.", label: "At home", image: "" },
    { product: products.find((item) => item.category === "beauty"), title: "Small rituals. Beautiful moments.", label: "Your daily edit", image: "" },
  ].filter((story) => story.product !== undefined);

  function goTo(index: number) {
    const element = track.current;
    const slide = element?.children[index] as HTMLElement | undefined;
    if (!element || !slide) return;
    element.scrollTo({ left: slide.offsetLeft - element.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  if (!stories.length) return null;

  return (
    <aside aria-label="Shopping inspiration" aria-roledescription="carousel" className="mt-6 min-w-0">
      <div ref={track} onScroll={(event) => {
        const element = event.currentTarget;
        const slides = Array.from(element.children) as HTMLElement[];
        const closest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - element.offsetLeft - element.scrollLeft) < Math.abs(slides[best].offsetLeft - element.offsetLeft - element.scrollLeft) ? index : best, 0);
        setActive(closest);
      }} className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl [scrollbar-width:none]">
        {stories.map(({ product, title, label, image }, index) => product && (
          <article key={product.id} aria-label={`${index + 1} of ${stories.length}`} aria-roledescription="slide" className="relative isolate flex min-h-44 min-w-0 basis-[94%] shrink-0 snap-start items-center overflow-hidden rounded-2xl border border-red-900/5 bg-stone-100 p-5 sm:min-h-56 sm:basis-[96%] sm:p-8">
            <img src={image || product.thumbnail} alt={image ? "Fresh vegetables in a paper bag" : product.title} loading="lazy" className={`absolute inset-y-0 right-0 -z-10 h-full w-[62%] ${image ? "object-cover object-[center_65%]" : "object-contain p-3"}`} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-stone-100 via-stone-100/95 to-transparent" />
            <div className="w-[62%] max-w-xs">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-red-900">{label}</p>
              <h3 className="mt-2 text-lg font-semibold leading-tight tracking-tight text-stone-900 sm:text-2xl">{title}</h3>
              <p className="mt-2 truncate text-xs text-stone-600">{product.title}</p>
              <Link to={`/products/${product.id}`} aria-label={`Shop ${product.title}`} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-red-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900">Shop now <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="flex justify-center" aria-label="Choose inspiration slide">
        {stories.map((story, index) => <button key={story.label} type="button" onClick={() => goTo(index)} aria-label={`Show ${story.label}`} aria-current={active === index ? "true" : undefined} className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-red-900"><span className={`h-1.5 rounded-full ${active === index ? "w-5 bg-red-900" : "w-1.5 bg-stone-300"}`} /></button>)}
      </div>
    </aside>
  );
}
