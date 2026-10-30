import style from "../../assets/community-style.jpg";
import city from "../../assets/community-city.jpg";
import together from "../../assets/community-together.jpg";

const voices = [
  { image: style, alt: "Woman smiling in sunglasses and a purple jacket", label: "Make it personal", title: "A little more you.", quote: "The little details make the biggest difference. I love finding pieces that feel like my own style.", position: "object-[40%_35%]" },
  { image: city, alt: "Woman in a hat enjoying a shopping trip in the city", label: "Everyday discoveries", title: "Find joy in the everyday.", quote: "A thoughtful selection makes it easier to find something I will enjoy using again and again.", position: "object-[65%_35%]" },
  { image: together, alt: "Couple taking a selfie together in a shopping cart", label: "Better together", title: "Good finds. Shared moments.", quote: "Finding our favorites together is half the fun. There is always a new detail to discover.", position: "object-[55%_35%]" },
];

export default function CommunityStories() {
  return <section aria-labelledby="customer-voices-heading" className="mt-10 rounded-3xl border border-violet-100 bg-linear-to-b from-white to-violet-50 p-5 sm:p-8">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-[10px] font-semibold tracking-[0.2em] text-violet-700 uppercase">The people behind the inspiration</p><h2 id="customer-voices-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Everyday style. Shared stories.</h2></div>
      <p className="max-w-xs text-xs leading-5 text-slate-500">A little inspiration from the way we shop, style and celebrate everyday moments.</p>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-3">{voices.map((voice) => <figure key={voice.title} className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden"><img src={voice.image} alt={voice.alt} loading="lazy" className={`h-full w-full object-cover ${voice.position}`} /><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-violet-900">{voice.label}</span></div>
      <figcaption className="p-5"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-violet-200"><path d="M4 5h7v7H7c0 3 1 4 3 5l-2 3c-4-2-5-5-5-9V5Zm11 0h7v7h-4c0 3 1 4 3 5l-2 3c-4-2-5-5-5-9V5Z" /></svg><h3 className="mt-2 text-base font-semibold text-slate-900">{voice.title}</h3><blockquote className="mt-3 text-sm leading-6 text-slate-600">{voice.quote}</blockquote></figcaption>
    </figure>)}</div>
    <p className="mt-4 text-[11px] text-slate-500">Illustrative stories and photography, not verified customer reviews.</p>
  </section>;
}
