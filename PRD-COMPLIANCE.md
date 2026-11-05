# PRD Compliance Audit — 10X Shop

The repository contains `PLAN.md` and README scope documentation, but no separate diploma PRD file was found. Statuses below therefore use the documented CORE scope and explicitly mark unavailable verification.

## CORE

| Requirement | Status | Evidence |
| --- | --- | --- |
| Responsive storefront layout | NOT TESTED | Tailwind responsive classes exist; viewport run unavailable |
| DummyJSON product catalog | PASS | `src/api/products.ts`, `ProductsPage.tsx` |
| Product details by route | PASS | `/products/:id` registered in `src/App.tsx` |
| Loading/error/empty/invalid states | PASS | Catalog and product page branches exist |
| Demo login and AuthContext | PARTIAL | Context exists; minimum password rule is absent |
| Shared cart state | PASS | `CartProvider.tsx` exposes immutable cart operations |
| Stock-aware quantities | PASS | Add/set operations clamp to `product.stock` |
| Protected checkout | PASS | `CheckoutPage.tsx` redirects guests to `/login` |
| Checkout field validation | PASS | Required fields and email format are validated |
| Local order confirmation and cart clearing | PASS | Successful submit calls `clearCart()` and renders confirmation |
| Unknown-route recovery | PASS | Wildcard route renders `NotFoundPage` |
| Direct nested-route deployment fallback | PASS | `vercel.json` rewrites to `index.html` |

## FULL / BONUS

| Area | Status | Notes |
| --- | --- | --- |
| Wishlist, profile, journal, filters, sorting | PASS | Implemented in source |
| Real authentication, payments, orders, delivery | MISSING | Explicitly out of scope in README |
| Automated Playwright suite | MISSING | Test scaffold/dependency absent |
| Lighthouse and axe-core CI | NOT TESTED | No tooling/configuration present |

## Priority plan

1. Fix BUG-001 and confirm the intended password rule with the official PRD.
2. Install/configure Playwright and add API-mocked deterministic tests.
3. Run Chromium, Firefox, WebKit, mobile viewport, axe, and deployed-route checks.
