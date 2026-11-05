import { Link, useSearchParams } from "react-router";

type PaginationProps = {
  page: number;
  totalPages: number;
};

const base = "flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

/** Page links keep every other URL parameter (q, category, price, sort) intact. */
function Pagination({ page, totalPages }: PaginationProps) {
  const [params] = useSearchParams();
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const next = new URLSearchParams(params);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    const query = next.toString();
    return `/products${query ? `?${query}` : ""}`;
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link to={hrefFor(page - 1)} className={`${base} border border-slate-200 bg-white text-slate-700 hover:bg-brand-50`}>Previous</Link>
      ) : (
        <span aria-disabled="true" className={`${base} border border-slate-100 text-slate-400`}>Previous</span>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          to={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          aria-label={`Page ${number}`}
          className={`${base} ${number === page ? "bg-brand-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-brand-50"}`}
        >
          {number}
        </Link>
      ))}
      {page < totalPages ? (
        <Link to={hrefFor(page + 1)} className={`${base} border border-slate-200 bg-white text-slate-700 hover:bg-brand-50`}>Next</Link>
      ) : (
        <span aria-disabled="true" className={`${base} border border-slate-100 text-slate-400`}>Next</span>
      )}
    </nav>
  );
}

export default Pagination;
