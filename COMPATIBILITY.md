# Compatibility — 10X Shop

Run started (UTC): 2026-11-05T12:22:33.398Z. Duration: 177.5 seconds. Local production build: http://127.0.0.1:4173. Desktop: 1440×900; Mobile: 390×844. Chromium, Firefox, and WebKit are Playwright browser engines; branded Chrome/Firefox/Safari applications and physical phones were not tested. Firefox Mobile uses viewport and touch emulation only.

Playwright tests replace DummyJSON responses with one fixed product (QA Beauty Product), using favicon.svg as its image. This verifies the UI and shopping flow but does not verify the live API or real product images. Lighthouse uses real network requests; its results apply to the state displayed during each run.

Tests: 14 passed, 22 failed, 0 skipped. FAIL includes axe violations and does not always indicate a broken page or keyboard flow.

## Testing Tools and Methodology

- **Playwright Test 1.64.1**: automated browser tests against the Vite production build, using six projects (three engines × Desktop/Mobile). Two workers, no retries, and a 60-second timeout per test.
- **@axe-core/playwright 4.14.0**: automated accessibility scans with WCAG 2.0/2.1 Level A and AA tags (wcag2a, wcag2aa, wcag21a, wcag21aa). Scans run on the five page states and on checkout when the keyboard flow reaches it.
- **Lighthouse 13.6.0**: Accessibility-only audits of Catalog and Login in Desktop and Mobile modes, using Playwright Chromium. Performance, SEO, and Best Practices were not measured in this run.
- **Functional smoke testing**: verify page headings, product navigation, add-to-cart, guest checkout redirect, login return navigation, delivery form submission, and order confirmation. This suite does not exhaustively test prices, stock boundaries, form errors, or persistence.
- **Responsive layout checks**: compare document scroll width with viewport width (1px tolerance) on the five matrix pages. Capture full-page screenshots with animations disabled. Screenshots are evidence, not automated pixel-diff visual regression tests.
- **Keyboard end-to-end testing**: reach controls through Tab and activate them with Enter; enter credentials and delivery data through keyboard typing. Targets are located using accessible roles and labels. The test fails if a target remains unreachable after 180 Tab presses.
- **Repeatability and evidence**: intercept DummyJSON requests with a deterministic fixture, isolate each test in a browser context, retain traces/screenshots on failure, and produce HTML/JSON reports. These are automated browser checks; they are not manual screen-reader testing or certification of WCAG compliance.

## Page × Browser × Device

| Scenario | chromium-desktop | chromium-mobile | firefox-desktop | firefox-mobile | webkit-desktop | webkit-mobile |
| --- | --- | --- | --- | --- | --- | --- |
| matrix: catalog | FAIL | PASS | FAIL | PASS | FAIL | PASS |
| matrix: product | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL |
| matrix: cart-empty | FAIL | PASS | FAIL | PASS | FAIL | PASS |
| matrix: login | FAIL | PASS | FAIL | PASS | FAIL | PASS |
| matrix: not-found | FAIL | PASS | timedOut | PASS | FAIL | PASS |
| keyboard: catalog → product → cart → login → checkout → confirmation | FAIL | PASS | FAIL | PASS | FAIL | FAIL |

The matrix covers Catalog, Product Details, empty Cart, Login, 404, and populated Cart/Checkout/Confirmation within the shopping flow. Home, Journal, Wishlist, Profile, and supporting pages are outside the scope of this run.

## Isolated Firefox Recheck

The main run timed out on the Firefox Desktop 404 scenario and reported a browser-context protocol error during cleanup. An isolated recheck started at 2026-11-05T12:25:41.847Z: 0 passed, 1 failed, 0 skipped. The page loaded and the overflow check completed; the remaining failure was the header label-content-name-mismatch axe assertion. The protocol timeout did not recur in this isolated run and is not confirmed as an application defect. This supplemental result does not replace the main matrix. Evidence: [firefox-recheck.json](docs/compat/firefox-recheck.json) and docs/compat/recheck-artifacts/.

## Confirmed Accessibility Findings

- **label-content-name-mismatch** (serious): Elements must have their visible text as part of their accessible name. Observed in chromium-desktop, firefox-desktop, webkit-desktop.
  Example affected elements:

  - `<a aria-label="Cart, 0 items" class="relative flex min-h-..." href="/cart" data-discover="true">`
  - `<button type="button" aria-expanded="false" aria-controls="shopping-panel" aria-label="Open wishlist (0 ite..." class="flex size-11 shrink-...">`
  - `<button type="button" aria-expanded="false" aria-controls="shopping-panel" aria-label="Open cart (0 items)" class="flex size-11 shrink-...">`
  - `<a aria-label="Cart, 0 items" aria-current="page" class="relative flex min-h-..." href="/cart" data-discover="true">`

- **color-contrast** (serious): Elements must meet minimum color contrast ratio thresholds. Observed in chromium-desktop, chromium-mobile, firefox-desktop, firefox-mobile, webkit-desktop, webkit-mobile.
  Example affected elements:

  - `<span class="pb-3 text-stone-400">Additional information</span>`

- Exact failure reasons and selectors are recorded in `docs/compat/report/index.html`, `results.json`, and `artifacts/`.

## Keyboard Navigation

The shopping flow uses Tab, Enter, and keyboard typing: Catalog → Product → Add to cart → View cart → Checkout → Login → Return to checkout → Complete all four fields → Place order → Confirmation. No click/focus/fill actions are used to complete this flow. When the only keyboard test error is an axe assertion, the flow reached confirmation and the FAIL refers to accessibility. This is not a complete assessment of every dropdown, focus trap, Shift+Tab interaction, or screen reader.

| Engine | Desktop keyboard flow | Mobile keyboard flow |
| --- | --- | --- |
| chromium | PASS flow (separate axe FAIL) | PASS |
| firefox | PASS flow (separate axe FAIL) | PASS |
| webkit | BLOCKED: keyboard target unreachable | BLOCKED: keyboard target unreachable |

The WebKit control experiment uses plain `<a>`, `<button>`, and `<input>` elements. Tab/Alt+Tab reaches only the button and input, skipping the link even without the application. Evidence: `docs/compat/webkit-keyboard-baseline.json`; reproduce with `node scripts/compat-webkit-keyboard.mjs`. This indicates a limitation of the test environment keyboard-navigation mode and is not classified as an application defect. A retest in real Safari with keyboard navigation enabled is required. Full keyboard compliance therefore remains unverified.

## Lighthouse Accessibility

| Page | Desktop | Mobile |
| --- | --- | --- |
| catalog | 100/100 | 100/100 |
| login | 100/100 | 100/100 |

A score of 100 does not establish full WCAG compliance. Lighthouse and axe use different scoring and audits. The table below lists failed Lighthouse audits independently of each score. Reports: `docs/compat/lighthouse/*.html` and `*.json`. Lighthouse Mobile uses its default mobile viewport.

- catalog / desktop: captured 2026-11-05T12:23:00.752Z; failed audits: label-content-name-mismatch; run warnings: none.
- catalog / mobile: captured 2026-11-05T12:23:20.334Z; failed audits: none; run warnings: none.
- login / desktop: captured 2026-11-05T12:23:13.366Z; failed audits: label-content-name-mismatch; run warnings: none.
- login / mobile: captured 2026-11-05T12:23:29.645Z; failed audits: none; run warnings: none.

## Screenshots

- [chromium-desktop-cart-empty.png](docs/compat/chromium-desktop-cart-empty.png)
- [chromium-desktop-cart-populated.png](docs/compat/chromium-desktop-cart-populated.png)
- [chromium-desktop-catalog.png](docs/compat/chromium-desktop-catalog.png)
- [chromium-desktop-checkout.png](docs/compat/chromium-desktop-checkout.png)
- [chromium-desktop-confirmation.png](docs/compat/chromium-desktop-confirmation.png)
- [chromium-desktop-login.png](docs/compat/chromium-desktop-login.png)
- [chromium-desktop-not-found.png](docs/compat/chromium-desktop-not-found.png)
- [chromium-desktop-product.png](docs/compat/chromium-desktop-product.png)
- [chromium-mobile-cart-empty.png](docs/compat/chromium-mobile-cart-empty.png)
- [chromium-mobile-cart-populated.png](docs/compat/chromium-mobile-cart-populated.png)
- [chromium-mobile-catalog.png](docs/compat/chromium-mobile-catalog.png)
- [chromium-mobile-checkout.png](docs/compat/chromium-mobile-checkout.png)
- [chromium-mobile-confirmation.png](docs/compat/chromium-mobile-confirmation.png)
- [chromium-mobile-login.png](docs/compat/chromium-mobile-login.png)
- [chromium-mobile-not-found.png](docs/compat/chromium-mobile-not-found.png)
- [chromium-mobile-product.png](docs/compat/chromium-mobile-product.png)
- [firefox-desktop-cart-empty.png](docs/compat/firefox-desktop-cart-empty.png)
- [firefox-desktop-cart-populated.png](docs/compat/firefox-desktop-cart-populated.png)
- [firefox-desktop-catalog.png](docs/compat/firefox-desktop-catalog.png)
- [firefox-desktop-checkout.png](docs/compat/firefox-desktop-checkout.png)
- [firefox-desktop-confirmation.png](docs/compat/firefox-desktop-confirmation.png)
- [firefox-desktop-login.png](docs/compat/firefox-desktop-login.png)
- [firefox-desktop-not-found.png](docs/compat/firefox-desktop-not-found.png)
- [firefox-desktop-product.png](docs/compat/firefox-desktop-product.png)
- [firefox-mobile-cart-empty.png](docs/compat/firefox-mobile-cart-empty.png)
- [firefox-mobile-cart-populated.png](docs/compat/firefox-mobile-cart-populated.png)
- [firefox-mobile-catalog.png](docs/compat/firefox-mobile-catalog.png)
- [firefox-mobile-checkout.png](docs/compat/firefox-mobile-checkout.png)
- [firefox-mobile-confirmation.png](docs/compat/firefox-mobile-confirmation.png)
- [firefox-mobile-login.png](docs/compat/firefox-mobile-login.png)
- [firefox-mobile-not-found.png](docs/compat/firefox-mobile-not-found.png)
- [firefox-mobile-product.png](docs/compat/firefox-mobile-product.png)
- [webkit-desktop-cart-empty.png](docs/compat/webkit-desktop-cart-empty.png)
- [webkit-desktop-catalog.png](docs/compat/webkit-desktop-catalog.png)
- [webkit-desktop-login.png](docs/compat/webkit-desktop-login.png)
- [webkit-desktop-not-found.png](docs/compat/webkit-desktop-not-found.png)
- [webkit-desktop-product.png](docs/compat/webkit-desktop-product.png)
- [webkit-mobile-cart-empty.png](docs/compat/webkit-mobile-cart-empty.png)
- [webkit-mobile-catalog.png](docs/compat/webkit-mobile-catalog.png)
- [webkit-mobile-login.png](docs/compat/webkit-mobile-login.png)
- [webkit-mobile-not-found.png](docs/compat/webkit-mobile-not-found.png)
- [webkit-mobile-product.png](docs/compat/webkit-mobile-product.png)

## Reproducing the Results

```bash
npm run build
node node_modules/@playwright/test/cli.js test --config=playwright.compat.config.ts
# The preview server must be running for Lighthouse:
node scripts/compat-lighthouse.mjs
node scripts/compat-report.mjs
```
