import { useState } from "react";
import { Link } from "react-router";
import bags from "../../assets/hero-bags.jpg";
import eyewear from "../../assets/hero-eyewear.jpg";
import fragrance from "../../assets/hero-fragrance.jpg";

const slides = [
  { image: bags, label: "The signature collection", title: "Carry a little elegance.", description: "Discover bags that bring the finishing touch to your everyday style.", action: "Explore bags", category: "womens-bags" },
  { image: eyewear, label: "A fresh perspective", title: "Make your entrance.", description: "Find statement sunglasses and give your everyday look a new point of view.", action: "Shop eyewear", category: "sunglasses" },
  { image: fragrance, label: "Your daily ritual", title: "Leave a lasting impression.", description: "Discover fragrances with character, chosen for your most memorable moments.", action: "Discover fragrances", category: "fragrances" },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  return (
    <section aria-label="Featured collections" aria-roledescription="carousel" className="relative isolate overflow-hidden rounded-3xl bg-violet-100">
      <div className="relative min-h-[420px] sm:min-h-[460px]">
        {slides.map((slide, index) => <article key={slide.category} aria-hidden={active !== index} aria-label={`${index + 1} of ${slides.length}: ${slide.label}`} aria-roledescription="slide" inert={active !== index} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
          <img src={slide.image} alt="" fetchPriority={index === 0 ? "high" : "auto"} className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-violet-950/85 via-violet-950/45 to-transparent" />
          <div className="relative flex h-full max-w-[85%] flex-col justify-center px-6 pb-16 pt-8 text-white sm:max-w-[65%] sm:px-10">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-100 uppercase">{slide.label}</p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{slide.title}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-violet-50">{slide.description}</p>
            <Link to={`/products?category=${slide.category}`} className="mt-6 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-violet-900 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{slide.action}<span aria-hidden="true">→</span></Link>
          </div>
        </article>)}
      </div>
      <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1" aria-label="Choose collection">
        {slides.map((slide, index) => <button key={slide.category} type="button" onClick={() => setActive(index)} aria-label={`Show ${slide.label}`} aria-current={active === index ? "true" : undefined} className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"><span className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${active === index ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white"}`} /></button>)}
      </div>
    </section>
  );
}
