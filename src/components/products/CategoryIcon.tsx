export function CategoryIcon({ slug }: { slug: string }) {
  const path = /beauty|skin/.test(slug) ? "M9 10h6v11H9zM10 10V5l4-3v8M7 21h10"
    : /fragrance/.test(slug) ? "M8 8h8v13H8zM10 3h4v5M8 12h8M16 5h4"
    : /furniture|home/.test(slug) ? "M5 12V6h14v6M3 12h18v7H3zM5 19v3M19 19v3"
    : /grocer/.test(slug) ? "M4 9h16l-2 12H6L4 9ZM8 9l4-7 4 7M9 13v4M15 13v4"
    : /phone|laptop|tablet/.test(slug) ? "M7 2h10v20H7zM10 18h4"
    : /shoe/.test(slug) ? "M3 14V7h5l3 7 10 3v4H3zM11 14l3-3"
    : /watch/.test(slug) ? "M9 2h6l1 6v8l-1 6H9l-1-6V8l1-6ZM8 8h8v8H8zM12 10v3h2"
    : /shirt|dress|top/.test(slug) ? "M8 3 3 6l-2 5 5 2v9h12v-9l5-2-2-5-5-3c0 4-8 4-8 0Z"
    : /vehicle|motor/.test(slug) ? "M3 11l3-7h12l3 7v8H3v-8ZM3 11h18M6 15h2M16 15h2M5 19v3M19 19v3"
    : /sunglass/.test(slug) ? "M2 10h8v6H2zM14 10h8v6h-8zM10 12h4M2 10l2-6M22 10l-2-6"
    : "M12 3 3 8v10l9 4 9-4V8l-9-5ZM3 8l9 5 9-5M12 13v9";
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d={path} /></svg>;
}
