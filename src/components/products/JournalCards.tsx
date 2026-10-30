import { Link } from "react-router";
import { stories } from "../../data/journal";

export default function JournalCards() {
  return <section className="mt-10" aria-labelledby="journal-heading">
    <p className="text-[10px] font-semibold tracking-[0.18em] text-violet-700 uppercase">The 10X journal</p>
    <h2 id="journal-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">A little inspiration for your everyday.</h2>
    <div className="mt-5 grid gap-5 md:grid-cols-2">{stories.map((story) => <Link key={story.slug} to={`/journal/${story.slug}`} className="group overflow-hidden rounded-3xl border border-violet-100 bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700">
      <div className="aspect-[16/9] overflow-hidden"><img src={story.image} alt={story.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
      <div className="p-5 sm:p-6"><p className="text-[10px] font-semibold tracking-widest text-violet-700 uppercase">{story.label} · 2 min read</p><h3 className="mt-2 text-xl font-semibold text-slate-900">{story.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{story.intro}</p><span className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-violet-700">Read the story <span aria-hidden="true">→</span></span></div>
    </Link>)}</div>
  </section>;
}
