# Project Plan

## Full status summary

The objective is the PRD CORE shopping flow: catalog, product details, simulated login, shared cart, protected checkout, local confirmation, responsive UI, error handling, deployment and documentation.

Completed: Vite/React/strict TypeScript/Tailwind v4 setup; routing and responsive catalog; typed DummyJSON API; product details and invalid-ID handling; AuthContext; immutable CartContext with totals/promo/shipping; controlled checkout and confirmation; dark theme; deployment rewrite; compatibility, keyboard, pricing, accessibility, Lighthouse and live verification.

Remaining optional FULL work: pagination, persistent order details, Formik + Yup and CI automation.

1. Set up Vite, React, TypeScript, Tailwind CSS, and the project structure.
2. Build a responsive shared layout and navigation.
3. Connect to DummyJSON and implement the product catalog and product details.
4. Add login and shared authentication state.
5. Implement the cart, including quantity changes and item removal.
6. Build and validate the checkout form.
7. Add loading, empty, and error states; review accessibility and responsive behavior.
8. If time allows, add search, filtering, sorting, orders, and a profile page.
9. Run checks, document the project, and deploy it.

## Goal and CORE scope

Deliver the complete CORE shopping flow: browse DummyJSON products, view details, authenticate through a simulated AuthContext, manage a shared cart, protect checkout, validate delivery fields, and show a local order confirmation.

## Work breakdown structure

| Epic | Tasks | Hours | Week |
| --- | --- | ---: | ---: |
| Auth | Context, controlled login, required fields, checkout return | 4 | 1 |
| Catalog | API, loading/error/empty states, ProductCard/ProductGrid | 6 | 1 |
| Product | Params, invalid ID fallback, quantity and add-to-cart | 5 | 1 |
| Cart | Context, immutable updates, badge, totals, removal | 5 | 2 |
| Checkout | Guard, fields, validation, summary, clear cart | 6 | 2 |
| Quality | Error Boundary, debug log, accessibility, responsive checks | 5 | 2 |
| Docs | PLAN, README, REPORT, deployment and Git verification | 4 | 2 |

## Risks and mitigation

1. API/network failure — check `response.ok`, catch errors, and render a recoverable error state.
2. SPA deep-link 404 — use the committed Vercel rewrite and verify `/products/5` after deployment.
3. Mobile overflow — use mobile-first grids, `min-w-0`, wrapping controls, and test at 375px.

## Definition of Done

- All required routes and CORE flows work, including invalid IDs and protected checkout.
- Loading, error, and empty states are distinct; API failures do not crash the app.
- Cart updates are immutable and the header badge is synchronized.
- Forms have labels, validation, visible focus, hover, and disabled states.
- Lint, typecheck, and production build pass; documentation and deployment rewrite are committed.
