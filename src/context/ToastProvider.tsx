import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ToastTone } from "./toast-context";

type Toast = { id: number; message: string; tone: ToastTone };

const TOAST_DURATION_MS = 3000;

const tones: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-slate-200 bg-white text-slate-900",
  error: "border-amber-300 bg-amber-50 text-amber-900",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = nextId.current++;
    // Keep at most three messages on screen.
    setToasts((current) => [...current.slice(-2), { id, message, tone }]);
    timers.current.set(id, window.setTimeout(() => dismiss(id), TOAST_DURATION_MS));
  }, [dismiss]);

  // Clear pending timers when the provider unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {toasts.map((toast) => (
          <div key={toast.id} className={`pointer-events-auto flex min-h-11 w-full max-w-sm items-center justify-between gap-3 rounded-xl border px-4 py-2 text-sm font-semibold shadow-lg ${tones[toast.tone]}`}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-brand-700">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
