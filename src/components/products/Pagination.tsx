type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const base = "flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-40";

/** Page numbers with gaps: 1 … 4 5 6 … 17. */
function pageNumbers(page: number, totalPages: number): (number | "gap")[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((value) => value >= 1 && value <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((value, index): (number | "gap")[] => {
    const gap = index > 0 ? value - sorted[index - 1] : 1;
    if (gap === 2) return [value - 1, value]; // a single hidden page is shown instead of "…"
    return gap > 2 ? ["gap", value] : [value];
  });
}

/** ‹ 1 2 3 … N › — the current page is highlighted; ‹ and › are disabled at the edges. */
function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page" className={`${base} border border-slate-200 bg-white text-slate-700 hover:bg-brand-50`}>‹</button>
      {pageNumbers(page, totalPages).map((value, index) =>
        value === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-slate-500">…</span>
        ) : (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-current={value === page ? "page" : undefined}
            aria-label={`Page ${value}`}
            className={`${base} ${value === page ? "bg-brand-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-brand-50"}`}
          >
            {value}
          </button>
        ),
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page" className={`${base} border border-slate-200 bg-white text-slate-700 hover:bg-brand-50`}>›</button>
    </nav>
  );
}

export default Pagination;
