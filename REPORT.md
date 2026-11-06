# Project Report

## PRD compliance summary

The supplied PRD v1.1 defines CORE as the release minimum. CORE is implemented: React/Vite/TypeScript/Tailwind v4 setup, required routes, simulated authentication, catalog, product details, shared cart, protected checkout, responsive UI, error handling, deployment and documentation are present. Typecheck, lint, build, smoke, compatibility and live checks are recorded in this report and `COMPATIBILITY.md`.

Additional FULL work is partial by design: pagination, persistent Orders, and Formik/Yup are not complete. They are not CORE blockers. Appendix A expands the technical criteria, so any claim of complete FULL/BONUS compliance must be checked against that appendix separately.

## Project plan

The implementation plan covered setup, shared layout, DummyJSON catalog and product details, simulated authentication, shared cart, checkout, quality checks, documentation and deployment. Main risks were API failure, SPA deep-link 404s and mobile overflow; these were handled with error states, the Vercel rewrite and responsive testing. Definition of Done was: working CORE routes and flow, distinct loading/error/empty states, synchronized immutable cart state, accessible forms, passing lint/typecheck/build, and documented deployment.

## QA summary

The current release passes typecheck, lint, build, route/auth smoke tests, compatibility/pricing tests and all six deployed-site checks. axe found no WCAG A/AA violations in the tested light and dark pages. Lighthouse Accessibility scored 100/100 on the audited Catalog and Login pages. Remaining limitations are the manual Safari keyboard pass and desktop Lighthouse performance below 85 on Home and Product. Detailed browser/device matrices remain in `COMPATIBILITY.md`.

## Status

### Current verification — 2026-11-06

Everything was re-run from scratch on `main` after the bold dark theme was merged. Typecheck, lint and build pass. The compatibility/pricing/dark-theme suite reports 94 passed, 0 failed and 2 WebKit keyboard skips across six browser/device projects; the route/auth smoke suite reports 16 passed. axe found no WCAG A/AA violations on nine pages in the light theme or in the dark theme. Four Lighthouse Accessibility audits scored 100/100.

The deployed Vercel site passes all six live checks: direct product and checkout URLs load after a refresh, the shopping flow reaches confirmation, and the checkout total matches the discounted API price plus shipping ($18.94 for the checked product). The tracked deployment bugs are closed. See this report, `COMPATIBILITY.md` and `docs/compat/live-results.json`.

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

All FULL items of PRD Annex A were checked against the code; the list below matches the annex sections.

- **P2 Catalog (`/products`, with a six-product preview on `/`):** server-side requests (`/products`, `/products/search`, `/products/category/{slug}`) with `limit=12`, `skip = (page − 1) × 12` and `sortBy`/`order`; debounced search (one request per pause in typing), category filter, five sort options, pagination with "Showing 13–24 of 194", skeleton, Retry, `AbortController`; `q`, `category`, `sort` and `page` in the URL.
- **P3 Product:** gallery, stock-limited stepper, Description/Reviews tabs, review form (exact messages "Please select a rating" and "Comment must be at least 10 characters") stored as `shop_reviews`, recalculated average, related products from `/products/category/{slug}?limit=5`.
- **P4 Cart:** `useReducer` with `ADD_ITEM`/`SET_QTY`/`REMOVE_ITEM`/`CLEAR`/`APPLY_PROMO`/`REMOVE_PROMO`, `Cart implements ICart`, `StorageService<T>` (`shop_cart`), promo `10X10` shown as "Discount (10X10 −10%)", shipping $10 and free from $100, confirmation before clearing.
- **P5 Checkout:** phone, postal code and country fields with the exact messages from the annex; empty cart redirects to `/cart`; "Place order" disabled while submitting; "Thank you! Your order has been placed."
- **P6 Orders:** `Order` class (`create`, `getStatus`, `toJSON`), numbers `10X-00001`, status Processing < 1 min / Shipped 1–3 min / Delivered > 3 min refreshed every 30 s, grey/blue/green badges, Reorder with toast, orders kept after logout/login.
- **P7 Profile:** first/last name, email, phone with validation; light/dark theme (`shop_theme`, shared `ThemeContext`); "Clear local data" keeps session and theme.
- **P0/P1:** toast notifications, lazy routes, Formik + Yup login, "Log In" and "Back to catalog", Log out returns to the catalog.
- **T:** `ApiClient.get<T>()` with type guards, `ApiError` and `isApiError`, `AsyncState<T>`, `CartAction` with an exhaustive `never` check, `STORAGE_KEYS as const`, ESLint `no-explicit-any: error`; remaining `as` casts replaced by guards.
- **TW:** `brand` and `card` tokens in `@theme`, a `dark:` custom variant and a dark theme built from mirrored colour scales.
- **Bold dark theme (merged from `feature/bold-dark-theme`):** near-black page with violet and pink glows, neon violet accents, glowing primary buttons, gradient page titles, lighter violet-grey cards, and a light "product stage" behind every product photo so dark products stay visible. Panels with photos or brand colours keep their light-theme look (`.keep-light`).

DummyJSON gives 187 of 194 products a discount of 1–19.6%, so following the annex rule (badge when `discountPercentage ≥ 1`) puts a badge on almost every card. The rule is kept; a separate "Best deals" view (`/products?deals=1`) lists the 48 products with at least 15% off. The API cannot filter by discount, so the view combines a tiny `?select=discountPercentage` request (ids and discounts only) to count the deals with one page sorted by discount.

The price-range filter from the earlier version was removed: the annex lists it as out of scope (bonus), and it cannot be combined with server-side pagination.

## Lighthouse before and after

Production build on a local Vite preview server, Lighthouse 13 with default throttling. Reports: `docs/lighthouse/before/` and `docs/lighthouse/after/`; script: `scripts/lighthouse-perf.mjs`. Lighthouse's headless Chrome reports `prefers-color-scheme: dark`, so the "after" run audits the dark theme.

| Page | Mode | Performance | Accessibility | Best Practices | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home (/) | mobile | 87 → 86 | 100 → 100 | 100 → 100 | 3.8 s → 3.8 s | 0 → 0 |
| Product | mobile | 95 → 92 | 100 → 100 | 100 → 100 | 2.9 s → 3.0 s | 0 → 0 |
| Cart | mobile | 100 → 100 | 100 → 100 | 100 → 100 | 0.8 s → 0.8 s | 0 → 0 |
| Home (/) | desktop | 76 → 79 | 100 → 100 | 100 → 100 | 5.0 s → 3.6 s | 0.06 → 0.016 |
| Product | desktop | 78 → 83 | 100 → 100 | 100 → 100 | 2.9 s → 2.9 s | 0.15 → 0.016 |
| Cart | desktop | 97 → 99 | 100 → 100 | 100 → 100 | 0.8 s → 0.8 s | 0.083 → 0.016 |

What changed between the runs:

1. The catalog requests one page of 12 products instead of all 194 (`limit=0`). Home sections that used the full list now make small requests: one product per category for The Signature Edit (`?limit=1`) and `?limit=4&sortBy=…` for the rails.
2. Route-level code splitting. Lazy-loading every page at first made results worse (mobile product CLS 0.661); catalog, product and cart stay in the entry chunk and the main area reserves its height (`DEBUG-LOG.md` entry 10).
3. Hidden hero slides download their photo only when shown; card images have width and height; restored home sections keep their size while loading (`DEBUG-LOG.md` entry 14).

Current run after the bold dark theme (`docs/lighthouse/current/`, 2026-11-06):

| Page | Mode | Performance | Accessibility | Best Practices | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home (/) | mobile | 89 | 100 | 100 | 3.7 s | 0 |
| Product | mobile | 94 | 100 | 100 | 3.0 s | 0 |
| Cart | mobile | 100 | 100 | 100 | 0.9 s | 0 |
| Home (/) | desktop | 80 | 100 | 100 | 3.2 s | 0.013 |
| Product | desktop | 83 | 100 | 100 | 2.9 s | 0.013 |
| Cart | desktop | 98 | 100 | 100 | 0.9 s | 0.013 |

FULL targets (Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, CLS < 0.1): accessibility, best practices and CLS meet them on every measured page; performance meets them on mobile for every page and on desktop for the cart. The home page on desktop (80) and product details on desktop (83) stay below 85 because the home page keeps its image-led storefront sections (hero, collection banners, journal). The script still labels `/` as "catalog", the name it had in the baseline run. Local runs vary by several points and are not a substitute for an audit of the deployed site.

## Out of scope

Real authentication, payment processing, delivery and server-side data are out of scope by the PRD.

## Planned vs delivered

The planned CORE scope was delivered: catalog, product details, simulated auth, shared cart, protected checkout, confirmation, error handling, responsive layout, and deployment configuration. Wishlist, profile, journal, filters, sorting, and collection sections were delivered additionally. Real authentication, payments, persistent orders, and delivery remain intentionally out of scope for this front-end demo.

## Metrics and verification

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- JavaScript entry chunk: approximately 323 kB raw / 93 kB gzip (annex target ≤ 250 kB gzip); route chunks load on demand (login chunk ~81 kB with Formik + Yup).
- CSS bundle: approximately 83 kB raw / 15 kB gzip (including the dark theme).
- Git history contains multiple meaningful `feat:`, `fix:`, `perf:`, and `docs:` commits.
- Lighthouse before/after results for the local production build are in the "Lighthouse before and after" section.
- Playwright: 94 compatibility/pricing/dark-theme tests and 16 smoke tests pass in Chromium, Firefox and WebKit; 6/6 live checks pass on the deployed site.

## Three difficult problems and solutions

1. Checkout was initially unreachable; the route, controlled form, guard, return state, and confirmation were connected.
2. Stock-aware cart quantities had to remain consistent across cards, details, header, and cart; `CartContext` became the single immutable state owner.
3. Vercel deep links needed a server fallback; `vercel.json` now rewrites all paths to `index.html`.

## What I would do differently

I would add automated route/context tests earlier, use violet token names consistently instead of compatibility aliases, and run Lighthouse and browser smoke tests in CI.

## AI usage

AI helped inspect the codebase, identify missing requirements, suggest component boundaries, and review error/accessibility states. Every change was checked against source code, the style guide, TypeScript, ESLint, and the production build. Suggestions that would invent deployment or browser results were rejected. No credentials or real payment data were added. Final UX and implementation decisions remained with the developer.
