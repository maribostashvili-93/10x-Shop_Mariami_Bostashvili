import { useState, type FormEvent } from "react";
import { useCart } from "../../hooks/useCart";

function PromoCodeForm() {
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Enter a promo code.");
      return;
    }
    if (applyPromo(code)) {
      setCode("");
      setError("");
    } else {
      setError("Invalid promo code");
    }
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm">
        <p role="status" className="font-semibold text-brand-800">
          {promo.code} applied (−{promo.percent}%)
        </p>
        <button type="button" onClick={removePromo} className="min-h-11 rounded-lg px-3 font-semibold text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-brand-700">
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="promo-code" className="block text-sm font-medium text-slate-900">Promo code</label>
      <div className="mt-2 flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(event) => { setCode(event.target.value); setError(""); }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "promo-code-error" : undefined}
          autoComplete="off"
          className={`min-h-11 min-w-0 flex-1 rounded-lg border bg-white px-3 uppercase text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${error ? "border-amber-600" : "border-slate-300"}`}
        />
        <button type="submit" className="min-h-11 rounded-lg border border-brand-700 px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          Apply
        </button>
      </div>
      {error && <p id="promo-code-error" role="alert" className="mt-2 text-sm text-amber-800">{error}</p>}
    </form>
  );
}

export default PromoCodeForm;
