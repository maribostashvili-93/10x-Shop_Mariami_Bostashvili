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
    <div ref={popup} popover="manual" className="fixed inset-auto right-4 bottom-4 m-0 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p role="status" className="font-semibold">{message}</p>
          <Link to="/cart" onClick={onClose} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-red-900 underline focus-visible:outline-2 focus-visible:outline-red-900">View cart</Link>
        </div>
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-red-900">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </div>
  );
}
