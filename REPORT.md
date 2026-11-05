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

## FULL delivered

- Catalog: debounced search, category/price filters, five sort options, pagination (12 per page) and full URL state.
- Product: review form (rating 1–5, comment ≥ 10 characters) stored in `localStorage`, recalculated average rating, same-category related products.
- Cart: `useReducer` with a discriminated-union action type, immutable `Cart` class, generic `StorageService<T>`, promo code `10X10` (−10%) with "Invalid promo code" feedback.
- Orders: `/orders` and `/orders/:id`, orders stored per user, simulated Processing → Shipped → Delivered status, Reorder respecting stock.
- Login: Formik + Yup with loading/disabled states and success/error feedback.
- TypeScript: generic `ApiClient` class with runtime type guards and `ApiError`; generics in `StorageService<T>`, `paginate<T>()` and `useDebounce<T>()`.
- Tailwind: custom `brand` colour and `card` radius tokens in `@theme`.

Not implemented: dark mode (BONUS), payment and real authentication (out of scope by the PRD).

## Lighthouse before and after

Production build on a local Vite preview server, Lighthouse 13 with default throttling. Reports: `docs/lighthouse/before/` and `docs/lighthouse/after/`; script: `scripts/lighthouse-perf.mjs`.

| Page | Mode | Performance | Accessibility | Best Practices | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Catalog | mobile | 87 → 97 | 100 → 100 | 100 → 100 | 3.8 s → 2.6 s | 0 → 0 |
| Product | mobile | 95 → 88 | 100 → 100 | 100 → 100 | 2.9 s → 2.9 s | 0 → 0 |
| Cart | mobile | 100 → 99 | 100 → 100 | 100 → 100 | 0.8 s → 0.8 s | 0 → 0 |
| Catalog | desktop | 76 → 70 | 100 → 100 | 100 → 100 | 5.0 s → 3.6 s | 0.06 → 0.06 |
| Product | desktop | 78 → 81 | 100 → 100 | 100 → 100 | 2.9 s → 3.0 s | 0.15 → 0.016 |
| Cart | desktop | 97 → 98 | 100 → 100 | 100 → 100 | 0.8 s → 0.8 s | 0.083 → 0.016 |

What changed between the runs:

1. Route-level code splitting. The first attempt lazy-loaded every page and made results worse (mobile product CLS 0.661, desktop cart 97 → 85) because the chunk request delayed rendering and the fallback moved the footer. Catalog, product and cart were moved back into the entry chunk and the main area now reserves its height. See `DEBUG-LOG.md` entry 10.
2. Hidden hero slides no longer download their images before they are shown, which cut mobile catalog LCP from 3.8 s to 2.6 s.
3. The entry JavaScript chunk shrank from 362 kB to 326 kB; Formik + Yup (~80 kB) load only with the login page.

Desktop catalog performance stays below 85: its score varies between runs on this machine (total blocking time 80–320 ms) and the hero image is still the LCP element. Local Lighthouse runs are not a substitute for an audit of the deployed site.

## Out of scope

Real authentication, payment processing, delivery and server-side data are out of scope by the PRD. Dark mode was not implemented.

## Planned vs delivered

The planned CORE scope was delivered: catalog, product details, simulated auth, shared cart, protected checkout, confirmation, error handling, responsive layout, and deployment configuration. Wishlist, profile, journal, filters, sorting, and collection sections were delivered additionally. Real authentication, payments, persistent orders, and delivery remain intentionally out of scope for this front-end demo.

## Metrics and verification

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- JavaScript entry chunk: approximately 326 kB raw / 95 kB gzip; route chunks are loaded on demand (login chunk ~81 kB with Formik + Yup).
- CSS bundle: approximately 63 kB raw / 12 kB gzip.
- Git history contains multiple meaningful `feat:`, `fix:`, `perf:`, and `docs:` commits.
- Lighthouse before/after results for the local production build are in the "Lighthouse before and after" section.
- Chrome and Firefox smoke testing is an external release check and is not provable from the compiler alone.

## Three difficult problems and solutions

1. Checkout was initially unreachable; the route, controlled form, guard, return state, and confirmation were connected.
2. Stock-aware cart quantities had to remain consistent across cards, details, header, and cart; `CartContext` became the single immutable state owner.
3. Vercel deep links needed a server fallback; `vercel.json` now rewrites all paths to `index.html`.

## What I would do differently

I would add automated route/context tests earlier, use violet token names consistently instead of compatibility aliases, and run Lighthouse and browser smoke tests in CI.

## AI usage

AI helped inspect the codebase, identify missing requirements, suggest component boundaries, and review error/accessibility states. Every change was checked against source code, the style guide, TypeScript, ESLint, and the production build. Suggestions that would invent deployment or browser results were rejected. No credentials or real payment data were added. Final UX and implementation decisions remained with the developer.
