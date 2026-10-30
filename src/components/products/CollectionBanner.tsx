import { useState } from "react";
import { Link } from "react-router";
import backpack from "../../assets/collection-backpack.jpg";
import watch from "../../assets/collection-watch.jpg";
import headphones from "../../assets/collection-headphones.jpg";

const slides = [
  { image: backpack, label: "Everyday elegance", title: "Ready for wherever life takes you.", text: "Explore bags and accessories with a little more personality.", action: "Explore bags", to: "/products?category=womens-bags", alt: "Purple backpack surrounded by floating pens" },
  { image: watch, label: "The timepiece edit", title: "Make every moment yours.", text: "Discover watches that put the finishing touch on your everyday style.", action: "Discover watches", to: "/products?category=womens-watches", alt: "Purple watch with a leather strap" },
  { image: headphones, label: "A different rhythm", title: "Find your everyday favorites.", text: "Discover our curated collection of thoughtful everyday accessories.", action: "Explore the collection", to: "/products", alt: "Purple headphones floating among soft sound waves" },
];

export default function CollectionBanner() {
  const [active, setActive] = useState(0);
  return (
    <div role="region" aria-label="Accessory collections" aria-roledescription="carousel" className="relative isolate overflow-hidden rounded-2xl bg-violet-950">
      <div className="relative min-h-80 sm:min-h-72">
        {slides.map((slide, index) => <article key={slide.image} inert={index !== active} aria-hidden={index !== active} aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.label}`} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
          <img src={slide.image} alt={slide.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-violet-950/95 via-violet-950/70 to-violet-950/5" />
          <div className="relative max-w-[85%] px-6 pb-14 pt-7 sm:max-w-[58%] sm:px-8">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-violet-200 uppercase">{slide.label}</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{slide.title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-violet-100">{slide.text}</p>
            <Link to={slide.to} className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-xl bg-white px-4 text-xs font-semibold text-violet-900 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{slide.action}<span aria-hidden="true">→</span></Link>
          </div>
        </article>)}
      </div>
      <div className="absolute inset-x-0 bottom-1 z-20 flex justify-center gap-1" aria-label="Choose accessory collection">{slides.map((slide, index) => <button key={slide.image} type="button" onClick={() => setActive(index)} aria-label={`Show ${slide.label}`} aria-current={index === active ? "true" : undefined} className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"><span className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${index === active ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} /></button>)}</div>
    </div>
  );
}
