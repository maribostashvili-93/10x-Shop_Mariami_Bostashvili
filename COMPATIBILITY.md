# Compatibility — 10X Shop

Run started (UTC): 2026-11-06T20:04:19.983Z. Duration: 229.5 seconds. Local production build: http://127.0.0.1:4173. Desktop: 1440×900; Mobile: 390×844. Chromium, Firefox, and WebKit are Playwright browser engines; branded Chrome/Firefox/Safari applications and physical phones were not tested. Firefox Mobile uses viewport and touch emulation only.

Matrix and keyboard tests replace DummyJSON responses with one fixed product (QA Beauty Product), using favicon.svg as its image. Pricing regression tests use six products with different discounts and boundary prices. This verifies the UI and shopping flow but does not verify the live API or real product images. Lighthouse uses real network requests; its results apply to the state displayed during each run. Deployed-site checks, when available, are recorded separately in docs/compat/live-results.json and QA-REPORT.md.

Tests: 94 passed, 0 failed, 2 skipped. FAIL includes axe violations and does not always indicate a broken page or keyboard flow.

## Testing Tools and Methodology

- **Playwright Test 1.64.1**: automated browser tests against the Vite production build, using six projects (three engines × Desktop/Mobile). Two workers, no retries, and a 60-second timeout per test.
- **@axe-core/playwright 4.14.0**: automated accessibility scans with WCAG 2.0/2.1 Level A and AA tags (wcag2a, wcag2aa, wcag21a, wcag21aa). Scans run on the nine matrix pages in the light theme, on the same nine pages again in the dark theme, and on checkout when the keyboard flow reaches it.
- **Lighthouse 13.6.0**: Accessibility-only audits of Catalog and Login in Desktop and Mobile modes, using Playwright Chromium. Performance, SEO, and Best Practices were not measured in this run.
- **Functional smoke testing**: verify page headings, product navigation, add-to-cart, guest checkout redirect, login return navigation, delivery form submission, and order confirmation.
- **Pricing regression testing**: verify all three price bands and ascending/descending sort against displayed discounted prices, including exact $50/$100 boundaries and rounding to cents. Verify reload and search/sort preservation through filter changes and browser Back/Forward. Stock boundaries, all form errors, and persistence are not exhaustively tested by this suite.
- **Responsive layout checks**: compare document scroll width with viewport width (1px tolerance) on the nine matrix pages. Capture full-page screenshots with animations disabled. Screenshots are evidence, not automated pixel-diff visual regression tests.
- **Keyboard end-to-end testing**: reach controls through Tab and activate them with Enter; enter credentials and delivery data through keyboard typing. Targets are located using accessible roles and labels. The test fails if a target remains unreachable after 180 Tab presses.
- **Repeatability and evidence**: intercept DummyJSON requests with a deterministic fixture, isolate each test in a browser context, retain traces/screenshots on failure, and produce HTML/JSON reports. These are automated browser checks; they are not manual screen-reader testing or certification of WCAG compliance.

## Page × Browser × Device

| Scenario | chromium-desktop | chromium-mobile | firefox-desktop | firefox-mobile | webkit-desktop | webkit-mobile |
| --- | --- | --- | --- | --- | --- | --- |
| matrix: home | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: catalog | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: best-deals | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: product | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: cart-empty | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: login | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: orders | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: profile | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: not-found | PASS | PASS | PASS | PASS | PASS | PASS |
| dark: every matrix page passes axe in the dark theme | PASS | PASS | PASS | PASS | PASS | PASS |
| keyboard: catalog → product → cart → login → checkout → confirmation | PASS | PASS | PASS | PASS | skipped | skipped |
| pricing: cards show the discounted price, original price and badge | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: sorting is requested from the API and kept in the URL history | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: cart adds $10 shipping below $100 and applies 10X10 | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: Best deals lists only products with 15% off or more | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: the cart advert reveals 10X10 and applies it | PASS | PASS | PASS | PASS | PASS | PASS |

The matrix covers Home, Catalog, Best deals, Product Details, empty Cart, Login, Orders, Profile and 404, plus populated Cart, Checkout and Confirmation within the keyboard flow. Orders and Profile are opened as a signed-in demo shopper. The dark row repeats the axe scan on all nine pages with the dark theme saved, and stores Home and Catalog screenshots (`*-home-dark.png`, `*-catalog-dark.png`). Journal and Wishlist pages are outside the scope of this run.

## Confirmed Accessibility Findings

- No violations were recorded in the available axe attachments.
- Every result, including axe output, is stored in `docs/compat/results.json`. The HTML report and failure traces (`docs/compat/report/`, `docs/compat/artifacts/`) are generated locally by the run and are not committed.

## Keyboard Navigation

The shopping flow uses Tab, Enter, and keyboard typing: Catalog → Product → Add to cart → View cart → Checkout → Login → Return to checkout → Fill in the delivery details → Place order → Confirmation. No click/focus/fill actions are used to complete this flow. When the only keyboard test error is an axe assertion, the flow reached confirmation and the FAIL refers to accessibility. This is not a complete assessment of every dropdown, focus trap, Shift+Tab interaction, or screen reader.

| Engine | Desktop keyboard flow | Mobile keyboard flow |
| --- | --- | --- |
| chromium | PASS | PASS |
| firefox | PASS | PASS |
| webkit | SKIPPED: WebKit keyboard environment limitation | SKIPPED: WebKit keyboard environment limitation |

The WebKit control experiment uses plain `<a>`, `<button>`, and `<input>` elements. Tab/Alt+Tab reaches only the button and input, skipping the link even without the application. Evidence: `docs/compat/webkit-keyboard-baseline.json`; reproduce with `node scripts/compat-webkit-keyboard.mjs`. This indicates a limitation of the test environment keyboard-navigation mode and is not classified as an application defect. A retest in real Safari with keyboard navigation enabled is required. Full keyboard compliance therefore remains unverified.

## Lighthouse Accessibility

| Page | Desktop | Mobile |
| --- | --- | --- |
| catalog | 100/100 | 100/100 |
| login | 100/100 | 100/100 |

A score of 100 does not establish full WCAG compliance. Lighthouse and axe use different scoring and audits. Failed Lighthouse audits, if any, are listed below independently of each score. Reports: `docs/compat/lighthouse/*.html` and `*.json`. Lighthouse Mobile uses its default mobile viewport.

- catalog / desktop: captured 2026-11-05T23:13:05.759Z; failed audits: none; run warnings: none.
- catalog / mobile: captured 2026-11-05T23:13:19.433Z; failed audits: none; run warnings: none.
- login / desktop: captured 2026-11-05T23:13:13.321Z; failed audits: none; run warnings: none.
- login / mobile: captured 2026-11-05T23:13:26.213Z; failed audits: none; run warnings: none.

## Screenshots

- [chromium-desktop-best-deals.png](docs/compat/current/chromium-desktop-best-deals.png)
- [chromium-desktop-cart-empty.png](docs/compat/current/chromium-desktop-cart-empty.png)
- [chromium-desktop-cart-populated.png](docs/compat/current/chromium-desktop-cart-populated.png)
- [chromium-desktop-catalog-dark.png](docs/compat/current/chromium-desktop-catalog-dark.png)
- [chromium-desktop-catalog.png](docs/compat/current/chromium-desktop-catalog.png)
- [chromium-desktop-checkout.png](docs/compat/current/chromium-desktop-checkout.png)
- [chromium-desktop-confirmation.png](docs/compat/current/chromium-desktop-confirmation.png)
- [chromium-desktop-home-dark.png](docs/compat/current/chromium-desktop-home-dark.png)
- [chromium-desktop-home.png](docs/compat/current/chromium-desktop-home.png)
- [chromium-desktop-login.png](docs/compat/current/chromium-desktop-login.png)
- [chromium-desktop-not-found.png](docs/compat/current/chromium-desktop-not-found.png)
- [chromium-desktop-orders.png](docs/compat/current/chromium-desktop-orders.png)
- [chromium-desktop-product.png](docs/compat/current/chromium-desktop-product.png)
- [chromium-desktop-profile.png](docs/compat/current/chromium-desktop-profile.png)
- [chromium-mobile-best-deals.png](docs/compat/current/chromium-mobile-best-deals.png)
- [chromium-mobile-cart-empty.png](docs/compat/current/chromium-mobile-cart-empty.png)
- [chromium-mobile-cart-populated.png](docs/compat/current/chromium-mobile-cart-populated.png)
- [chromium-mobile-catalog-dark.png](docs/compat/current/chromium-mobile-catalog-dark.png)
- [chromium-mobile-catalog.png](docs/compat/current/chromium-mobile-catalog.png)
- [chromium-mobile-checkout.png](docs/compat/current/chromium-mobile-checkout.png)
- [chromium-mobile-confirmation.png](docs/compat/current/chromium-mobile-confirmation.png)
- [chromium-mobile-home-dark.png](docs/compat/current/chromium-mobile-home-dark.png)
- [chromium-mobile-home.png](docs/compat/current/chromium-mobile-home.png)
- [chromium-mobile-login.png](docs/compat/current/chromium-mobile-login.png)
- [chromium-mobile-not-found.png](docs/compat/current/chromium-mobile-not-found.png)
- [chromium-mobile-orders.png](docs/compat/current/chromium-mobile-orders.png)
- [chromium-mobile-product.png](docs/compat/current/chromium-mobile-product.png)
- [chromium-mobile-profile.png](docs/compat/current/chromium-mobile-profile.png)
- [firefox-desktop-best-deals.png](docs/compat/current/firefox-desktop-best-deals.png)
- [firefox-desktop-cart-empty.png](docs/compat/current/firefox-desktop-cart-empty.png)
- [firefox-desktop-cart-populated.png](docs/compat/current/firefox-desktop-cart-populated.png)
- [firefox-desktop-catalog-dark.png](docs/compat/current/firefox-desktop-catalog-dark.png)
- [firefox-desktop-catalog.png](docs/compat/current/firefox-desktop-catalog.png)
- [firefox-desktop-checkout.png](docs/compat/current/firefox-desktop-checkout.png)
- [firefox-desktop-confirmation.png](docs/compat/current/firefox-desktop-confirmation.png)
- [firefox-desktop-home-dark.png](docs/compat/current/firefox-desktop-home-dark.png)
- [firefox-desktop-home.png](docs/compat/current/firefox-desktop-home.png)
- [firefox-desktop-login.png](docs/compat/current/firefox-desktop-login.png)
- [firefox-desktop-not-found.png](docs/compat/current/firefox-desktop-not-found.png)
- [firefox-desktop-orders.png](docs/compat/current/firefox-desktop-orders.png)
- [firefox-desktop-product.png](docs/compat/current/firefox-desktop-product.png)
- [firefox-desktop-profile.png](docs/compat/current/firefox-desktop-profile.png)
- [firefox-mobile-best-deals.png](docs/compat/current/firefox-mobile-best-deals.png)
- [firefox-mobile-cart-empty.png](docs/compat/current/firefox-mobile-cart-empty.png)
- [firefox-mobile-cart-populated.png](docs/compat/current/firefox-mobile-cart-populated.png)
- [firefox-mobile-catalog-dark.png](docs/compat/current/firefox-mobile-catalog-dark.png)
- [firefox-mobile-catalog.png](docs/compat/current/firefox-mobile-catalog.png)
- [firefox-mobile-checkout.png](docs/compat/current/firefox-mobile-checkout.png)
- [firefox-mobile-confirmation.png](docs/compat/current/firefox-mobile-confirmation.png)
- [firefox-mobile-home-dark.png](docs/compat/current/firefox-mobile-home-dark.png)
- [firefox-mobile-home.png](docs/compat/current/firefox-mobile-home.png)
- [firefox-mobile-login.png](docs/compat/current/firefox-mobile-login.png)
- [firefox-mobile-not-found.png](docs/compat/current/firefox-mobile-not-found.png)
- [firefox-mobile-orders.png](docs/compat/current/firefox-mobile-orders.png)
- [firefox-mobile-product.png](docs/compat/current/firefox-mobile-product.png)
- [firefox-mobile-profile.png](docs/compat/current/firefox-mobile-profile.png)
- [mobile-chat-account-fixed.png](docs/compat/current/mobile-chat-account-fixed.png)
- [webkit-desktop-best-deals.png](docs/compat/current/webkit-desktop-best-deals.png)
- [webkit-desktop-cart-empty.png](docs/compat/current/webkit-desktop-cart-empty.png)
- [webkit-desktop-catalog-dark.png](docs/compat/current/webkit-desktop-catalog-dark.png)
- [webkit-desktop-catalog.png](docs/compat/current/webkit-desktop-catalog.png)
- [webkit-desktop-home-dark.png](docs/compat/current/webkit-desktop-home-dark.png)
- [webkit-desktop-home.png](docs/compat/current/webkit-desktop-home.png)
- [webkit-desktop-login.png](docs/compat/current/webkit-desktop-login.png)
- [webkit-desktop-not-found.png](docs/compat/current/webkit-desktop-not-found.png)
- [webkit-desktop-orders.png](docs/compat/current/webkit-desktop-orders.png)
- [webkit-desktop-product.png](docs/compat/current/webkit-desktop-product.png)
- [webkit-desktop-profile.png](docs/compat/current/webkit-desktop-profile.png)
- [webkit-mobile-best-deals.png](docs/compat/current/webkit-mobile-best-deals.png)
- [webkit-mobile-cart-empty.png](docs/compat/current/webkit-mobile-cart-empty.png)
- [webkit-mobile-catalog-dark.png](docs/compat/current/webkit-mobile-catalog-dark.png)
- [webkit-mobile-catalog.png](docs/compat/current/webkit-mobile-catalog.png)
- [webkit-mobile-home-dark.png](docs/compat/current/webkit-mobile-home-dark.png)
- [webkit-mobile-home.png](docs/compat/current/webkit-mobile-home.png)
- [webkit-mobile-login.png](docs/compat/current/webkit-mobile-login.png)
- [webkit-mobile-not-found.png](docs/compat/current/webkit-mobile-not-found.png)
- [webkit-mobile-orders.png](docs/compat/current/webkit-mobile-orders.png)
- [webkit-mobile-product.png](docs/compat/current/webkit-mobile-product.png)
- [webkit-mobile-profile.png](docs/compat/current/webkit-mobile-profile.png)

## Reproducing the Results

```bash
npm run build
node node_modules/@playwright/test/cli.js test --config=playwright.compat.config.ts
# The preview server must be running for Lighthouse:
node scripts/compat-lighthouse.mjs
node scripts/compat-report.mjs
```
