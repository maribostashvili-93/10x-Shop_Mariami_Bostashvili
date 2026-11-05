# QA Report — 10X Shop

Updated: 2026-11-06. Every check below was re-run from scratch on the current `main` (bold dark theme merged). This report replaces the previous one, which still listed two open deployment bugs.

## Executive summary

The local production build passes typecheck, lint, the route/auth smoke suite and the compatibility/pricing suite. axe found no WCAG A/AA violations in the light theme or in the dark theme. The deployed Vercel site now passes every live check: direct product URLs and `/checkout` load after a refresh, the shopping flow reaches confirmation, and the checkout total matches the discounted API price plus shipping. BUG-004 and BUG-005 are fixed on the deployed site.

## Current results

| Check | Passed | Failed | Skipped | Evidence |
| --- | --- | --- | --- | --- |
| Compatibility + pricing + dark theme, six browser/device projects | 94 | 0 | 2 | docs/compat/results.json, [COMPATIBILITY.md](COMPATIBILITY.md) |
| Route/auth smoke, four browser projects | 16 | 0 | 0 | docs/compat/smoke-results.json |
| Deployed-site checks, real network | 6 | 0 | 0 | docs/compat/live-results.json, docs/compat/live/ |
| Lighthouse Accessibility (Catalog, Login × Desktop/Mobile) | 4 × 100/100 | — | — | docs/compat/lighthouse/ |
| Lighthouse Performance (Catalog, Product, Cart × Desktop/Mobile) | see below | — | — | docs/lighthouse/current/ |

The two compatibility skips are the known WebKit keyboard-navigation limitation, reproduced on plain HTML (docs/compat/webkit-keyboard-baseline.json). They are not passes.

`npm run typecheck`, `npm run lint` and `npm run build` completed without errors.

## Test environment and methods

- Local Vite production build: http://127.0.0.1:4173.
- Playwright Test 1.64.1; Chromium, Firefox, WebKit; Desktop 1440×900 and Mobile 390×844. The smoke mobile project uses Chromium.
- Deterministic DummyJSON interception for the compatibility and pricing tests. The smoke product-link test and the live checks use the real API.
- @axe-core/playwright 4.14.0 with WCAG 2.0/2.1 A/AA tags, on nine pages (Home, Catalog, Best deals, Product, empty Cart, Login, Orders, Profile, 404) in the light theme and again in the dark theme, plus Checkout.
- Keyboard flow: Catalog → Product → Add to cart ("Added ✓") → header Cart → Login → Checkout → Confirmation, using Tab, Shift+Tab, Enter and typing.
- Pricing: discounted card prices, API sorting kept in URL history, $10 shipping below $100, the 10X10 promo, Best deals (15% off or more) and the promo advert.
- Full-page screenshots are evidence, not pixel-diff tests. Local images: docs/compat/current/ (dark theme: `*-home-dark.png`, `*-catalog-dark.png`).
- Live checks use isolated browser contexts and synthetic demo login and delivery data. No real payment exists in the app.

## Accessibility and performance

No axe A/AA violations were recorded on any scanned page, in either theme. This does not establish complete WCAG compliance or replace screen-reader testing.

Lighthouse Accessibility on local Catalog and Login: 100/100 on Desktop and Mobile.

Lighthouse Performance, local production build, default throttling (Lighthouse's headless Chrome reports `prefers-color-scheme: dark`, so this run audits the dark theme):

| Page | Mobile perf. | Desktop perf. | Mobile LCP | Desktop LCP | CLS | A11y | Best practices |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home / catalog | 89 | 80 | 3.7 s | 3.2 s | 0 / 0.013 | 100 | 100 |
| Product | 94 | 83 | 3.0 s | 2.9 s | 0 / 0.013 | 100 | 100 |
| Cart | 100 | 98 | 0.9 s | 0.9 s | 0 / 0.013 | 100 | 100 |

Desktop performance on Home (80) and Product (83) is below the 85 target. The largest cost is the product photos and the DummyJSON responses, which arrive over the real network. Scores vary by a few points between runs. `scripts/lighthouse-perf.mjs` now repeats a page once when Lighthouse reports a broken trace (NO_NAVSTART), which otherwise shows up as a performance score of 0.

## Deployed verification

Target: https://10x-shop-mariami-bostashvili-mt61.vercel.app (run 2026-11-05 23:56 UTC).

- Home: HTTP 200, application shell visible.
- `/products/5` on Desktop and Mobile: HTTP 200, the product heading and Add to cart are visible, and the same product is shown after a refresh. No horizontal overflow on Mobile.
- Direct `/checkout` as a guest: HTTP 200, redirects to Login.
- Shopping flow: Catalog → Product → Add to cart ("Added ✓") → Cart → Login → Checkout → Place order → Confirmation → empty Cart.
- Price accuracy: Essence Mascara Lash Princess costs $9.99 with a 10.48% discount. The expected total is $8.94 + $10 shipping = $18.94, and the live checkout shows $18.94.

`scripts/qa-live.mjs` was updated for the current interface ("Added ✓" instead of the old pop-up, the header Cart link, the "Log In" button, the phone and postal-code fields, and shipping in the total).

## Release recommendation

Local and deployed checks pass. Open items: a manual keyboard pass in real Safari (WebKit automation cannot Tab to links), and desktop performance on Home and Product below 85.
