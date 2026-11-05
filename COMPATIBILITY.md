# Compatibility — 10X Shop

Run started (UTC): 2026-11-05T19:04:05.980Z. Duration: 82.8 seconds. Local production build: http://127.0.0.1:4173. Desktop: 1440×900; Mobile: 390×844. Chromium, Firefox, and WebKit are Playwright browser engines; branded Chrome/Firefox/Safari applications and physical phones were not tested. Firefox Mobile uses viewport and touch emulation only.

Matrix and keyboard tests replace DummyJSON responses with one fixed product (QA Beauty Product), using favicon.svg as its image. Pricing regression tests use six products with different discounts and boundary prices. This verifies the UI and shopping flow but does not verify the live API or real product images. Lighthouse uses real network requests; its results apply to the state displayed during each run. Deployed-site checks, when available, are recorded separately in docs/compat/live-results.json and QA-REPORT.md.

Tests: 52 passed, 0 failed, 2 skipped. FAIL includes axe violations and does not always indicate a broken page or keyboard flow.

## Testing Tools and Methodology

- **Playwright Test 1.64.1**: automated browser tests against the Vite production build, using six projects (three engines × Desktop/Mobile). Two workers, no retries, and a 60-second timeout per test.
- **@axe-core/playwright 4.14.0**: automated accessibility scans with WCAG 2.0/2.1 Level A and AA tags (wcag2a, wcag2aa, wcag21a, wcag21aa). Scans run on the five page states and on checkout when the keyboard flow reaches it.
- **Lighthouse 13.6.0**: Accessibility-only audits of Catalog and Login in Desktop and Mobile modes, using Playwright Chromium. Performance, SEO, and Best Practices were not measured in this run.
- **Functional smoke testing**: verify page headings, product navigation, add-to-cart, guest checkout redirect, login return navigation, delivery form submission, and order confirmation.
- **Pricing regression testing**: verify all three price bands and ascending/descending sort against displayed discounted prices, including exact $50/$100 boundaries and rounding to cents. Verify reload and search/sort preservation through filter changes and browser Back/Forward. Stock boundaries, all form errors, and persistence are not exhaustively tested by this suite.
- **Responsive layout checks**: compare document scroll width with viewport width (1px tolerance) on the five matrix pages. Capture full-page screenshots with animations disabled. Screenshots are evidence, not automated pixel-diff visual regression tests.
- **Keyboard end-to-end testing**: reach controls through Tab and activate them with Enter; enter credentials and delivery data through keyboard typing. Targets are located using accessible roles and labels. The test fails if a target remains unreachable after 180 Tab presses.
- **Repeatability and evidence**: intercept DummyJSON requests with a deterministic fixture, isolate each test in a browser context, retain traces/screenshots on failure, and produce HTML/JSON reports. These are automated browser checks; they are not manual screen-reader testing or certification of WCAG compliance.

## Page × Browser × Device

| Scenario | chromium-desktop | chromium-mobile | firefox-desktop | firefox-mobile | webkit-desktop | webkit-mobile |
| --- | --- | --- | --- | --- | --- | --- |
| matrix: catalog | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: product | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: cart-empty | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: login | PASS | PASS | PASS | PASS | PASS | PASS |
| matrix: not-found | PASS | PASS | PASS | PASS | PASS | PASS |
| keyboard: catalog → product → cart → login → checkout → confirmation | PASS | PASS | PASS | PASS | skipped | skipped |
| pricing: cards show the discounted price, original price and badge | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: sorting is requested from the API and kept in the URL history | PASS | PASS | PASS | PASS | PASS | PASS |
| pricing: cart adds $10 shipping below $100 and applies 10X10 | PASS | PASS | PASS | PASS | PASS | PASS |

The matrix covers Catalog, Product Details, empty Cart, Login, 404, and populated Cart/Checkout/Confirmation within the shopping flow. Home, Journal, Wishlist, Profile, and supporting pages are outside the scope of this run.

## Confirmed Accessibility Findings

- No violations were recorded in the available axe attachments.
- Exact failure reasons and selectors are recorded in `docs/compat/report/index.html`, `results.json`, and `artifacts/`.

## Keyboard Navigation

The shopping flow uses Tab, Enter, and keyboard typing: Catalog → Product → Add to cart → View cart → Checkout → Login → Return to checkout → Complete all four fields → Place order → Confirmation. No click/focus/fill actions are used to complete this flow. When the only keyboard test error is an axe assertion, the flow reached confirmation and the FAIL refers to accessibility. This is not a complete assessment of every dropdown, focus trap, Shift+Tab interaction, or screen reader.

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

- catalog / desktop: captured 2026-11-05T19:14:32.848Z; failed audits: none; run warnings: none.
- catalog / mobile: captured 2026-11-05T19:14:47.603Z; failed audits: none; run warnings: none.
- login / desktop: captured 2026-11-05T19:14:41.478Z; failed audits: none; run warnings: none.
- login / mobile: captured 2026-11-05T19:14:54.314Z; failed audits: none; run warnings: none.

## Screenshots

- [chromium-desktop-cart-empty.png](docs/compat/current/chromium-desktop-cart-empty.png)
- [chromium-desktop-cart-populated.png](docs/compat/current/chromium-desktop-cart-populated.png)
- [chromium-desktop-catalog.png](docs/compat/current/chromium-desktop-catalog.png)
- [chromium-desktop-checkout.png](docs/compat/current/chromium-desktop-checkout.png)
- [chromium-desktop-confirmation.png](docs/compat/current/chromium-desktop-confirmation.png)
- [chromium-desktop-login.png](docs/compat/current/chromium-desktop-login.png)
- [chromium-desktop-not-found.png](docs/compat/current/chromium-desktop-not-found.png)
- [chromium-desktop-product.png](docs/compat/current/chromium-desktop-product.png)
- [chromium-mobile-cart-empty.png](docs/compat/current/chromium-mobile-cart-empty.png)
- [chromium-mobile-cart-populated.png](docs/compat/current/chromium-mobile-cart-populated.png)
- [chromium-mobile-catalog.png](docs/compat/current/chromium-mobile-catalog.png)
- [chromium-mobile-checkout.png](docs/compat/current/chromium-mobile-checkout.png)
- [chromium-mobile-confirmation.png](docs/compat/current/chromium-mobile-confirmation.png)
- [chromium-mobile-login.png](docs/compat/current/chromium-mobile-login.png)
- [chromium-mobile-not-found.png](docs/compat/current/chromium-mobile-not-found.png)
- [chromium-mobile-product.png](docs/compat/current/chromium-mobile-product.png)
- [firefox-desktop-cart-empty.png](docs/compat/current/firefox-desktop-cart-empty.png)
- [firefox-desktop-cart-populated.png](docs/compat/current/firefox-desktop-cart-populated.png)
- [firefox-desktop-catalog.png](docs/compat/current/firefox-desktop-catalog.png)
- [firefox-desktop-checkout.png](docs/compat/current/firefox-desktop-checkout.png)
- [firefox-desktop-confirmation.png](docs/compat/current/firefox-desktop-confirmation.png)
- [firefox-desktop-login.png](docs/compat/current/firefox-desktop-login.png)
- [firefox-desktop-not-found.png](docs/compat/current/firefox-desktop-not-found.png)
- [firefox-desktop-product.png](docs/compat/current/firefox-desktop-product.png)
- [firefox-mobile-cart-empty.png](docs/compat/current/firefox-mobile-cart-empty.png)
- [firefox-mobile-cart-populated.png](docs/compat/current/firefox-mobile-cart-populated.png)
- [firefox-mobile-catalog.png](docs/compat/current/firefox-mobile-catalog.png)
- [firefox-mobile-checkout.png](docs/compat/current/firefox-mobile-checkout.png)
- [firefox-mobile-confirmation.png](docs/compat/current/firefox-mobile-confirmation.png)
- [firefox-mobile-login.png](docs/compat/current/firefox-mobile-login.png)
- [firefox-mobile-not-found.png](docs/compat/current/firefox-mobile-not-found.png)
- [firefox-mobile-product.png](docs/compat/current/firefox-mobile-product.png)
- [webkit-desktop-cart-empty.png](docs/compat/current/webkit-desktop-cart-empty.png)
- [webkit-desktop-catalog.png](docs/compat/current/webkit-desktop-catalog.png)
- [webkit-desktop-login.png](docs/compat/current/webkit-desktop-login.png)
- [webkit-desktop-not-found.png](docs/compat/current/webkit-desktop-not-found.png)
- [webkit-desktop-product.png](docs/compat/current/webkit-desktop-product.png)
- [webkit-mobile-cart-empty.png](docs/compat/current/webkit-mobile-cart-empty.png)
- [webkit-mobile-catalog.png](docs/compat/current/webkit-mobile-catalog.png)
- [webkit-mobile-login.png](docs/compat/current/webkit-mobile-login.png)
- [webkit-mobile-not-found.png](docs/compat/current/webkit-mobile-not-found.png)
- [webkit-mobile-product.png](docs/compat/current/webkit-mobile-product.png)

## Reproducing the Results

```bash
npm run build
node node_modules/@playwright/test/cli.js test --config=playwright.compat.config.ts
# The preview server must be running for Lighthouse:
node scripts/compat-lighthouse.mjs
node scripts/compat-report.mjs
```
