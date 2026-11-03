# Project Report

## Status

The CORE scope from the graduation project PRD is implemented. The application is a responsive React SPA built with TypeScript, Tailwind CSS v4, React Router, and the DummyJSON products API.

## Completed CORE requirements

- Vite, React, strict TypeScript, Tailwind CSS v4, and project scripts.
- Responsive layout, routing, catalog, product details, login, cart, checkout, and 404 pages.
- Typed API data with loading, error, empty, and invalid-product states.
- Search, category and price filtering, sorting, and URL parameters.
- Local controlled login with React Context authentication state.
- Protected checkout with redirect-to-login and return navigation.
- Shared Cart Context with immutable add, remove, and quantity updates.
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

## Remaining checks before submission

1. Verify catalog → product → cart → login → checkout → confirmation manually.
2. Check CORE routes at 375px and desktop widths for horizontal scrolling.
3. Refresh direct deployed routes such as `/products/5` and `/checkout`.
4. Confirm the GitHub repository and meaningful commit history.

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
- JavaScript bundle: approximately 358 kB raw / 104 kB gzip.
- CSS bundle: approximately 60 kB raw / 11 kB gzip.
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
