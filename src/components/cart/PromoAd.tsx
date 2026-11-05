import { useEffect, useRef, useState } from "react";
import watchImage from "../../assets/collection-watch.webp";
import bagImage from "../../assets/hero-bags.webp";
import { PROMO_CODES } from "../../models/Cart";

const PROMO = PROMO_CODES["10X10"];
const AD_SECONDS = 3;

type PromoAdProps = {
  /** Applies the revealed code to the cart. */
  onApply: (code: string) => void;
};

/**
 * A short in-cart advert: the shopper watches a 3-second ad for the watch and
 * bag edit, then the promo code from the specification (10X10, −10% on the whole
 * order) is revealed and can be applied with one click.
 */
function PromoAd({ onApply }: PromoAdProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AD_SECONDS);
  const [copied, setCopied] = useState(false);
  const revealed = secondsLeft === 0;

  // Count down only while the ad is open; the code appears when it reaches 0.
  useEffect(() => {
    if (!open || revealed) return;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [open, revealed, secondsLeft]);

  function openAd() {
    setSecondsLeft(AD_SECONDS);
    setCopied(false);
    setOpen(true);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function applyCode() {
    onApply(PROMO.code);
    close();
  }

  return (
    <>
      <button
        type="button"
        onClick={openAd}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50 px-3 text-sm font-semibold text-violet-800 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M20 12 12 20 4 12V4h8l8 8ZM8 8h.01" /></svg>
        Unlock a promo code
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="promo-ad-title"
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-black/60"
      >
        {open && (
          <div>
            <div className="keep-light relative grid grid-cols-2 bg-violet-950">
              <img src={watchImage} alt="A silver wristwatch from the timepiece edit" width={320} height={240} className="h-48 w-full object-cover sm:h-56" />
              <img src={bagImage} alt="A structured handbag from the bag edit" width={320} height={240} className="h-48 w-full object-cover sm:h-56" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-violet-800 uppercase">Ad</span>
              <button type="button" onClick={close} aria-label="Close advert" className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-white/90 text-violet-800 hover:bg-white focus-visible:outline-2 focus-visible:outline-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-violet-700 uppercase">The timepiece &amp; bag edit</p>
              <h2 id="promo-ad-title" className="mt-2 text-2xl font-semibold tracking-tight">Make every moment — and every outfit — count.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Classic watches and structured bags that finish a look in seconds. Watch this short ad to unlock {PROMO.percent}% off your whole order.
              </p>

              {!revealed ? (
                <div className="mt-6">
                  <div className="h-2 overflow-hidden rounded-full bg-violet-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-violet-700 transition-[width] duration-1000 ease-linear motion-reduce:transition-none" style={{ width: `${((AD_SECONDS - secondsLeft + 1) / AD_SECONDS) * 100}%` }} />
                  </div>
                  <p role="status" className="mt-3 text-sm text-slate-600">Your code is coming up in {secondsLeft}…</p>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-4">
                  <p role="status" className="text-sm text-slate-700">
                    Your code: <span className="ml-1 rounded-md bg-white px-2 py-1 font-mono text-lg font-bold tracking-widest text-violet-800">{PROMO.code}</span>
                    <span className="ml-2 font-semibold text-emerald-700">−{PROMO.percent}%</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" autoFocus onClick={applyCode} className="min-h-11 flex-1 rounded-lg bg-violet-700 px-4 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
                      Apply code
                    </button>
                    <button type="button" onClick={copyCode} className="min-h-11 rounded-lg border border-violet-300 bg-white px-4 font-semibold text-violet-800 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
                      {copied ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

export default PromoAd;
