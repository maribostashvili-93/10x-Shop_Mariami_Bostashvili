import { useEffect, useRef } from "react";
import { Link } from "react-router";

export function CartToast({ message, onClose }: { message: string; onClose: () => void }) {
  const popup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) return;
    popup.current?.showPopover();
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div ref={popup} popover="manual" role="dialog" aria-modal="true" aria-label="Cart confirmation" className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-slate-950/35 p-4 text-slate-900 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-violet-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-violet-700"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m5 12 4 4L19 6" /></svg></span><p role="status" className="font-semibold">{message}</p></div>
            <Link to="/cart" onClick={onClose} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 underline focus-visible:outline-2 focus-visible:outline-violet-700">View cart</Link>
          </div>
          <button type="button" onClick={onClose} aria-label="Dismiss notification" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-700">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
