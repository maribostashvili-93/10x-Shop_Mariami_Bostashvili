# Project Report

## Status

### Current local verification and deployment limits — 2026-11-05

The local compatibility/pricing suite reports 70 passed, 0 failed, and 2 WebKit keyboard skips. The route/auth smoke suite reports 16 passed. Discounted-price filtering/sorting uses shared final-price calculations. Current axe scans found no violations; four local Lighthouse Accessibility audits scored 100/100.

Deployed verification is separate: home and in-app simulated checkout work, but direct product/checkout URLs return provider 404 and live checkout still charges the original API price ($9.99 rather than $8.94 for the checked product). These are open release blockers. See `QA-REPORT.md`, `BUG-REPORT.md`, and `docs/compat/live-results.json`. Earlier completion statements below concern implemented local source, not full deployed compliance.

The CORE scope from the graduation project PRD is implemented. The application is a responsive React SPA built with TypeScript, Tailwind CSS v4, React Router, and the DummyJSON products API.

## Completed CORE requirements

- Vite, React, strict TypeScript, Tailwind CSS v4, and project scripts.
- Responsive layout, routing, catalog, product details, login, cart, checkout, and 404 pages.
- Catalog grid on `/` from `GET /products?limit=12&skip=0` (1/2–3/4 responsive columns).
- Discounted price formula and stock status on product cards, product details, cart and checkout.
- API data read as `unknown` and validated with type guards; typed `ApiError`; loading, error with retry, empty, and not-found states.
- Search, category and price filtering, sorting, and URL parameters.
- Local controlled login with per-field validation (password ≥ 6 characters) and React Context authentication state.
- Protected checkout with redirect-to-login and return navigation.
- Shared Cart Context with immutable add, remove, quantity and clear-cart updates; Subtotal, Discount and Total.
- Header Catalog and Cart links with a live cart badge on every screen size.
- Controlled checkout fields, validation, local order confirmation, and cart clearing.
- Responsive Tailwind UI with hover, focus, disabled, loading, and error states.
- Error Boundary, debugging log, and public deployment link in `README.md`.

## Additional delivered features

- Wishlist page and state.
- Lifestyle journal pages with related products.
- Featured collections, community stories, category navigation, and expanded footer.

Authentication, payments, orders, delivery, and account services remain local/demo-only according to the PRD.

## Verification

- `npm run typecheck` — passed.
- `npm run build` — passed.
- `npm run lint` — passed after extracting the reusable `ProductGrid` and simplifying the search filter JSX.

## CORE completion pass

A requirements review against the PRD found and fixed these gaps (details in `DEBUG-LOG.md`, entries 4–7):

- Prices ignored `discountPercentage`; a shared `getFinalPrice` / `getCartTotals` now drives every price.
- Unknown product IDs showed a generic error; they now render the 404 page, and route changes reset state and cancel stale requests with `AbortController`.
- The desktop grid stayed at 3 columns because of Tailwind breakpoint ordering; it now shows 1 / 2–3 / 4 columns.
- Login accepted short passwords; it now validates each field.
- Illustrative colour/size selectors, tinted "gallery" copies and placeholder reviews were replaced with the real API images and reviews.

Verified locally in the browser: 12 catalog cards, 1 column at 375px without horizontal scroll, 4 columns at 1280px, `/products/99999` and `/products/abc` show 404, the cart shows Subtotal $9.99 / Discount −$1.05 / Total $8.94 for product 1, and login rejects empty and 3-character passwords and returns to checkout.

## Remaining checks before submission

1. Refresh direct deployed routes such as `/products/5` and `/checkout` after the next deployment.
2. Repeat the full shopping flow manually in Chrome and Firefox on the deployed site.

## Final verification notes

- Added a Vercel SPA rewrite so direct visits and refreshes such as `/products/5` resolve to the React application.
- Catalog rendering now uses a dedicated prop-driven `ProductGrid` component with stable product keys and responsive Tailwind columns.
- The lint issue was found by running ESLint, traced to an unreachable nested category expression in `ShopSearch`, and fixed by keeping the price select limited to price options.

## Out of scope for CORE

Real authentication, payment processing, delivery, persistent orders, profile services, Formik/Yup, lazy loading, Lighthouse optimization, and dark mode are FULL/BONUS extensions.

## Planned vs delivered

The planned CORE scope was delivered: catalog, product details, simulated auth, shared cart, protected checkout, confirmation, error handling, responsive layout, and deployment configuration. Wishlist, profile, journal, filters, sorting, and collection sections were delivered additionally. Real authentication, payments, persistent orders, and delivery remain intentionally out of scope for this front-end demo.

## Metrics and verification

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- JavaScript bundle: approximately 363 kB raw / 105 kB gzip.
- CSS bundle: approximately 63 kB raw / 12 kB gzip.
- Git history contains multiple meaningful `feat:`, `fix:`, `perf:`, and `docs:` commits.
- Lighthouse numeric results require a real deployed Mobile/Incognito run; no unverified score is claimed in this repository.
- Chrome and Firefox smoke testing is an external release check and is not provable from the compiler alone.

## Three difficult problems and solutions

1. Checkout was initially unreachable; the route, controlled form, guard, return state, and confirmation were connected.
2. Stock-aware cart quantities had to remain consistent across cards, details, header, and cart; `CartContext` became the single immutable state owner.
3. Vercel deep links needed a server fallback; `vercel.json` now rewrites all paths to `index.html`.

## What I would do differently

I would add automated route/context tests earlier, use violet token names consistently instead of compatibility aliases, and run Lighthouse and browser smoke tests in CI.

## AI usage

AI helped inspect the codebase, identify missing requirements, suggest component boundaries, and review error/accessibility states. Every change was checked against source code, the style guide, TypeScript, ESLint, and the production build. Suggestions that would invent deployment or browser results were rejected. No credentials or real payment data were added. Final UX and implementation decisions remained with the developer.
