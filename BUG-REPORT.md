# Bug Report — 10X Shop

Updated: 2026-11-06. Statuses distinguish current local source from the deployed site.

## BUG-001 — Product back link targeted home

- Severity: Low
- Status: CLOSED in local source; regression passed in all four smoke projects.
- Location: src/pages/ProductPage.tsx, “Back to products” link.
- Original reproduction: activate the product back link; it navigated to / rather than /products.
- Root cause: incorrect JSX link target.
- Resolution: target is now /products.
- Evidence: tests/qa.spec.ts and docs/compat/smoke-results.json.
- This status does not independently verify the deployed back link.

## BUG-002 — Short passwords were accepted

- Severity: Medium
- Status: CLOSED in local source; regression passed in all four smoke projects.
- Location: src/pages/LoginPage.tsx, validate and MIN_PASSWORD_LENGTH.
- Original reproduction: submit a username and one-to-five-character password; login succeeded.
- Root cause: validation checked only empty values.
- Resolution: six-character minimum and accessible field-specific errors.
- Evidence: tests/qa.spec.ts and docs/compat/smoke-results.json.
- The supplied DOCX describes required fields but does not establish the six-character rule itself. This implemented application rule also appears in the earlier user-supplied requirements summary.

## BUG-003 — Price bands and sorting ignored discounts

- Severity: Medium
- Status: FIXED locally; all 36 pricing regressions passed across six browser/device projects.
- Location: src/pages/ProductsPage.tsx, filtering/sorting; shared calculation in src/utils/formatPrice.ts.
- Reproduction before fix: supply a beauty product priced $60 with 50% discount and another priced $40 without discount. Open /products?price=under-50 or /products?sort=price-asc.
- Expected: the displayed $30 product appears under $50 and before the $40 product.
- Actual before fix: it was excluded from the band and sorted using its original $60 price.
- Root cause: comparisons used product.price while ProductPrice displayed getFinalPrice(product).
- Resolution: use shared rounded final prices for comparisons and both price sort directions.
- Evidence: tests/compat/pricing.spec.ts, pricing rows in docs/compat/results.json, and COMPATIBILITY.md.
- Deployment: verified on the live site on 2026-11-06 (live-discount-consistency PASS in docs/compat/live-results.json).

## BUG-004 — Deployed nested routes return provider 404

- Severity: High
- Status: FIXED on the deployed site (verified 2026-11-06). Direct `/products/5` and `/checkout` return HTTP 200 and survive a refresh on Desktop and Mobile.
- Target: https://10x-shop-mariami-bostashvili-mt61.vercel.app.
- Steps: open /products/5 directly on Desktop or Mobile; separately open /checkout directly.
- Expected: serve the SPA and show product details or redirect a guest to login, including after refresh.
- Actual: Vercel HTTP 404 NOT_FOUND; the root page returns HTTP 200.
- Investigation: in-app navigation works. The deployed server is not supplying the application for nested URLs. Exact Vercel project settings/build configuration were not inspected, so the underlying remote configuration cause remains unconfirmed.
- Suggested resolution: deploy current source with the existing vercel.json rewrite; verify project root/build settings and repeat direct URL/refresh checks.
- Evidence: docs/compat/live-results.json and the passing screenshots under docs/compat/live/ (the old failure screenshots were removed).

## BUG-005 — Deployed checkout uses the original price

- Severity: High
- Status: FIXED on the deployed site (verified 2026-11-06). The live checkout shows $8.94 + $10 shipping = $18.94, matching the API price and discount.
- Steps: open live home, use its shop link, add “Essence Mascara Lash Princess”, sign in with synthetic demo values, and inspect Checkout.
- Expected: API price $9.99 × (1 − 10.48/100), rounded to cents = $8.94.
- Actual: live summary/total show $9.99.
- Investigation: the actual product API response was captured during the check. Deployed behavior differs from local getFinalPrice/getCartTotals; the precise deployed revision is unknown.
- Suggested resolution: publish current discounted pricing implementation and rerun the live price check.
- Evidence: live-discount-consistency in docs/compat/live-results.json and docs/compat/live/desktop-checkout.png.

## Limitations

WebKit keyboard skips are an environment limitation, not confirmed application defects. Old axe failures are historical; current compatibility scans report none. Real authentication and payments are intentionally simulated, not missing CORE features.
