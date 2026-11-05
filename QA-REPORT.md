# QA Report — 10X Shop

Updated: 2026-11-05. This report supersedes the earlier 14-pass/22-fail audit, which described a previous build.

## Executive summary

The local production build passes typecheck, lint, the route/auth smoke suite, and the compatibility/pricing suite. Price filters and sorting now use the same rounded discounted price as product cards, cart, and checkout. No axe violations were reported by the current matrix scans.

The deployed site differs from the local build. Its home page and simulated shopping flow work through client-side navigation, but direct nested URLs return Vercel 404 and the live checkout ignores the API discount. Deployment remains a release blocker.

## Current results

| Check | Passed | Failed | Skipped | Evidence |
| --- | --- | --- | --- | --- |
| Compatibility + pricing, six browser/device projects | 70 | 0 | 2 | docs/compat/results.json |
| Route/auth smoke, four browser projects | 16 | 0 | 0 | docs/compat/smoke-results.json |
| Deployed-site checks, real network | 2 | 3 | 1 blocked | docs/compat/live-results.json |

The two compatibility skips are the existing WebKit keyboard-navigation limitation, reproduced independently on plain HTML. They are not passes. Live failures are Desktop/Mobile direct product access and checkout price consistency; direct guest checkout is blocked by the server 404.

Typecheck, lint, and production build completed successfully. The build includes strict TypeScript checking.

## Test environment and methods

- Local Vite production build: http://127.0.0.1:4173.
- Playwright Test 1.64.1; Chromium, Firefox, WebKit; Desktop 1440×900 and Mobile 390×844. The smoke mobile project explicitly uses Chromium.
- Deterministic DummyJSON interception for compatibility and pricing tests. The smoke product-link test uses the real API.
- @axe-core/playwright 4.14.0, WCAG 2.0/2.1 Level A/AA tags.
- Keyboard flow: Catalog → Product → Cart → Login → Checkout → Confirmation using Tab, Enter, and typing.
- Pricing: three bands, ascending/descending order, exact $50/$100 boundaries, cent rounding, reload, and filter/search/sort history preservation.
- Full-page screenshots are evidence, not pixel-diff visual regression tests. Current local images are under docs/compat/current/.
- Deployed checks use real network requests and isolated browser contexts with synthetic demo credentials/delivery data. No real payment was submitted.

Full methods, per-project matrix, screenshots, and limitations: [COMPATIBILITY.md](COMPATIBILITY.md).

## Accessibility and performance

Current matrix and checkout scans recorded no axe A/AA violations. This does not establish complete WCAG compliance or cover every menu, screen reader, focus trap, and Shift+Tab interaction.

Lighthouse Accessibility was rerun on local Catalog and Login: Desktop 100/100; Mobile 100/100 for both pages. HTML/JSON reports are under docs/compat/lighthouse/. These are local accessibility scores, not deployed-site performance scores. Performance, SEO, Best Practices, LCP, CLS, and INP were not measured in this run.

## Deployed verification

Target: https://10x-shop-mariami-bostashvili-mt61.vercel.app.

- Home: HTTP 200, application shell visible.
- /products/5: HTTP 404 on Desktop and Mobile; application refresh verification cannot proceed.
- Direct /checkout: HTTP 404 before the application can redirect to login.
- Through home-page links: Catalog → Product → Cart → Login → Checkout → Confirmation → empty Cart completed.
- Price accuracy failed independently: product 1 costs $9.99 with 10.48% API discount; expected total $8.94, live total $9.99.

The repository already contains the SPA rewrite in vercel.json and shared discounted calculations. Publishing current source and verifying Vercel routing is required. Exact remote project settings were not inspected, and this task did not deploy changes.

## Release recommendation

Review the local fix, publish the current build with vercel.json, and rerun node scripts/qa-live.mjs. Resolve BUG-004 and BUG-005 before claiming complete deployed CORE compliance. Local passing results do not establish that these live failures are fixed.
