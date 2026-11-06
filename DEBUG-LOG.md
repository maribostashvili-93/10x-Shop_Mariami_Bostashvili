# Debug Log

This document is the consolidated debugging and QA report. It records real issues found and fixed, verification evidence and remaining limitations. The project uses the browser Console and Network panel, React DevTools, the TypeScript compiler, production builds and Playwright.

## 1. Checkout page existed but the route did not exist

- **Symptom:** Clicking `Proceed to checkout` did not lead to a working checkout screen.
- **Reproduction:** Add a product to the cart, open `/cart`, and click `Proceed to checkout`.
- **Tool:** React Router route inspection and browser navigation.
- **Root cause:** `CheckoutPage.tsx` was empty and `/checkout` was not registered in `App.tsx`.
- **Fix:** Implemented the controlled checkout form, added the `/checkout` route, added the authenticated redirect, and connected order confirmation to `clearCart()`.
- **Fix (commit):** [e489902 feat: add checkout flow and not-found page](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/e489902)
- **What I learned:** A page component is not reachable until it is connected to the router and tested through the real user flow.

## 2. Guests could not complete the checkout flow safely

- **Symptom:** A user who was not signed in could reach checkout without a clear authentication step.
- **Reproduction:** Open `/checkout` directly while logged out.
- **Tool:** Browser address-bar navigation and React state inspection in React DevTools.
- **Root cause:** The checkout screen did not check `AuthContext.user` before rendering the form.
- **Fix:** Added a `Navigate` guard that redirects guests to `/login` with `{ from: "/checkout" }`. After login, `LoginPage` returns the user to checkout.
- **Fix (commit):** [e489902 feat: add checkout flow and not-found page](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/e489902)
- **What I learned:** Protected flows must be tested through direct URLs as well as button clicks.

## 3. Invalid URLs had no dedicated recovery experience

- **Symptom:** Unknown paths did not show a useful store-specific error page or recovery action.
- **Reproduction:** Open a URL such as `/does-not-exist`.
- **Tool:** Browser route testing and React Router route table review.
- **Root cause:** `NotFoundPage.tsx` was empty and the router had no `*` fallback route.
- **Fix:** Added a styled 404 page with a clear message and a keyboard-accessible `Back to home` action, then registered the wildcard route.
- **Fix (commit):** [e489902 feat: add checkout flow and not-found page](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/e489902)
- **What I learned:** Every route should have an intentional failure state and a clear way back into the product.

## 4. Catalog prices ignored the API discount

- **Symptom:** Product cards, product details, the cart and checkout all showed the original `price`, even for products with `discountPercentage` (for example product 1 showed $9.99 instead of $8.94).
- **Reproduction:** Open `/products/1`, add it to the cart and compare the cart total with `price × (1 − discountPercentage / 100)` from the Network response of `GET /products/1`.
- **Tool:** Chrome DevTools Network panel (response payload) and source review of every `product.price` usage.
- **Root cause:** Every component read `product.price` directly; there was no shared price calculation.
- **Fix:** Added `getFinalPrice`, `getCartTotals` and `formatPrice` in `src/utils/formatPrice.ts` and a `ProductPrice` component. All price displays and the cart/checkout Subtotal, Discount and Total now use them.
- **Fix (commit):** [655a720 fix: apply discounts and complete CORE cart/login/product requirements](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/655a720)
- **What I learned:** Business rules such as pricing belong in one shared function, not repeated in each component.

## 5. Non-existent product IDs showed a generic error instead of Not Found

- **Symptom:** `/products/99999` and `/products/abc` showed "Could not load product" instead of the Not Found page. Switching from one product to a related product could briefly show stale data and kept the previous quantity.
- **Reproduction:** Open `/products/99999`; then open `/products/1` and click a related product.
- **Tool:** Network panel (the API answers `404`), React DevTools (state `product`, `loading`, `quantity` kept between IDs).
- **Root cause:** `getProduct` threw the same error for 404 and network failures, and `ProductPage` never reset its state or cancelled the previous request when `id` changed.
- **Fix:** Added `ApiError` with an HTTP status in `src/api/client.ts`; `getProduct` returns `null` for invalid IDs and 404, so the page renders `NotFoundPage`. The page resets its state when the route ID changes and cancels old requests with `AbortController`. A real network failure shows a "Try again" button.
- **Fix (commit):** [655a720 fix: apply discounts and complete CORE cart/login/product requirements](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/655a720)
- **What I learned:** Separate "not found" from "failed to load"; they need different screens.

## 6. Desktop product grid stayed at three columns

- **Symptom:** At 1280px the catalog grid showed 3 columns instead of the required 4.
- **Reproduction:** Open `/` at a 1280px viewport and inspect the grid.
- **Tool:** Chrome DevTools Elements → Computed `grid-template-columns` (three tracks) and the generated CSS.
- **Root cause:** The grid used `md:grid-cols-3 min-[1025px]:grid-cols-4`. Tailwind v4 emitted the arbitrary `min-[1025px]` rule before the `md` rule, so `md:grid-cols-3` won the cascade.
- **Fix:** Used the theme breakpoint `lg:grid-cols-4`, which is ordered after `md`. Verified 1 column at 375px, 3 at 1024px and 4 at 1280px.
- **Fix (commit):** [655a720 fix: apply discounts and complete CORE cart/login/product requirements](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/655a720)
- **What I learned:** Mixing arbitrary and theme breakpoints can change cascade order; verify computed styles, not only class names.

## 7. Login accepted short passwords

- **Symptom:** A one-character password logged the user in, and both fields shared one generic error message.
- **Reproduction:** Open `/login`, enter `tester` and `123`, submit.
- **Tool:** Manual form testing and source review of `LoginPage`.
- **Root cause:** Validation only checked for empty values.
- **Fix:** Added a `validate` function with per-field errors (required username, password of at least 6 characters), shown next to each field with `aria-invalid` and `aria-describedby`.
- **Fix (commit):** [655a720 fix: apply discounts and complete CORE cart/login/product requirements](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/655a720)
- **What I learned:** Validation rules should mirror the specification exactly and be tested with empty, short and valid input.

## 8. Price filters and sorting used the original price

- **Symptom:** A product displayed at $30 ($60 with a 50% discount) was absent from Under $50 and appeared after a $40 product when sorted low to high.
- **Reproduction:** Supply those API products and open `/products?price=under-50` or `/products?sort=price-asc`.
- **Tool:** Chromium diagnosis with deterministic API responses, then Playwright regressions across all six compatibility projects.
- **Root cause:** `ProductsPage` compared `product.price`, while cards displayed `getFinalPrice(product)`.
- **Fix:** Use shared rounded final prices in price-band comparisons and both price sort directions.
- **Verification:** 36 pricing cases passed, including $50/$100 boundaries, cent rounding, reload, and filter/search/sort browser history.
- **Fix (commit):** [8e326bc fix: align catalog price filters and refresh QA evidence](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/8e326bc)
- **Deployment note:** Earlier live deep-link and checkout-pricing issues are now closed; their history is summarized in `QA-REPORT.md`.
- **What I learned:** Filtering, sorting, and display must use the same business-rule calculation.

## 9. Account menu linked to a missing page and to placeholder pages

- **Symptom:** "My Wishlist" in the header account menu opened the 404 page. Other menu items (My Orders, Coupons, Addresses, New Arrivals, Best Sellers, Brands, Collections) opened placeholder pages; My Orders always showed "No orders yet" and Coupons showed codes that did not work in the cart.
- **Reproduction:** Log in, open the account menu in the header and choose "My Wishlist"; then open `/my-orders` or `/coupons`.
- **Tool:** Browser navigation and the React Router route table.
- **Root cause:** Menu paths were generated from labels (`"My Wishlist"` → `/my-wishlist`), but the wishlist route is `/wishlist`. The placeholder routes were added for future features that are not in the CORE scope.
- **Fix:** Menus now use explicit `to` paths. Placeholder routes and links were removed; the working settings form moved to `AccountSettingsPage`. Removed paths now show the 404 page.
- **Fix (commit):** [192c198 fix: close remaining CORE gaps and remove placeholder pages](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/192c198)
- **What I learned:** Build links from explicit route constants, and do not show navigation for features that do not exist yet.

## 10. Lazy-loading every route made performance worse

- **Symptom:** After adding `React.lazy` to all pages, Lighthouse reported mobile product CLS 0.661 (before: 0) and desktop cart performance dropped from 97 to 85.
- **Reproduction:** `npm run build && node scripts/lighthouse-perf.mjs after` with all routes lazy.
- **Tool:** Lighthouse layout-shift and LCP breakdown audits; the shifted element was the `footer`.
- **Root cause:** While a page chunk downloaded, the short Suspense fallback let the footer rise into view; when the page rendered, the footer was pushed down. The extra chunk request also delayed LCP on the cart page.
- **Fix:** Keep catalog, product and cart in the entry chunk, lazy-load only less frequent or heavier pages, and give `main` a minimum height. Result: CLS 0–0.06 on all measured pages, mobile catalog 87 → 97.
- **Fix (commit):** [cda0eaa perf: tune code splitting and hero loading using Lighthouse results](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/cda0eaa)
- **What I learned:** An optimisation has to be measured; splitting code is not automatically faster.

## 11. Back button did nothing after filtering and searching

- **Symptom:** After choosing a price range and pressing Search, the first Back press stayed on the same results.
- **Reproduction:** Open `/products?q=Discounted&sort=price-asc`, choose "Under $50", press Search, then press Back.
- **Tool:** Playwright pricing regression test (`tests/compat/pricing.spec.ts`) failing in all six browser projects.
- **Root cause:** The price select already updates the URL; pressing Search navigated to the identical URL and created a duplicate history entry.
- **Fix:** Search only navigates when the resulting URL differs from the current one.
- **Fix (commit):** [5f64942 fix: avoid a duplicate history entry when searching after a filter change](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/5f64942)
- **What I learned:** Router navigation to the same URL still adds history; automated history tests catch this quickly.

## 12. Every sidebar category looked selected on product pages

- **Symptom:** On `/products/6` all nine category links in the sidebar had the selected (filled) style at the same time.
- **Reproduction:** Open any product page on a desktop-width window and look at "Shop by category".
- **Tool:** Browser screenshot during a visual check, then React DevTools on the `NavLink` elements (all reported `isActive: true`).
- **Root cause:** The links pointed to `/products?category=…`, and `NavLink` compares only the path. Every product URL starts with `/products`, so all of them matched.
- **Fix:** Category links now go to `/?category=…` and are plain `Link`s whose selected state (and `aria-current`) comes from the `category` search parameter on the catalog page.
- **Fix (commit):** [6d3e66f feat: move the catalog to / with server-side search, filters and paging](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/6d3e66f)
- **What I learned:** `NavLink` active state ignores the query string; filters stored in the URL need their own comparison.

## 13. Grey helper text failed contrast in the dark theme

- **Symptom:** Lighthouse Accessibility dropped from 100 to 96 on the catalog and login pages.
- **Reproduction:** Build, start the preview server and run `node scripts/compat-lighthouse.mjs`; the report lists `color-contrast` failures on `text-slate-500` text in the footer.
- **Tool:** Lighthouse accessibility audit (failing nodes with measured ratio 3.81:1 on background `#17141f`).
- **Root cause:** Lighthouse's headless Chrome prefers the dark colour scheme, so the dark theme was audited. The dark theme mirrors each colour scale (50 ↔ 950 …), which leaves shade 500 unchanged; slate-500 is readable on white (4.8:1) but not on the dark surface.
- **Fix:** In the dark theme the 500 shades use the lighter 400 values. Accessibility is back to 100 on all audited pages.
- **Fix (commit):** [0b4f1de fix: keep 4.5:1 text contrast for 500 shades in the dark theme](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/0b4f1de)
- **What I learned:** Every theme needs its own contrast check; an automated audit may not run in the theme you expect.

## 14. Restored home sections pushed the catalog down while loading

- **Symptom:** After the storefront sections returned to the catalog page, Lighthouse reported CLS 0.122 (mobile) and 0.125 (desktop) on `/`, above the 0.1 target.
- **Reproduction:** `npm run build && node scripts/lighthouse-perf.mjs after`, then open the catalog report's "Layout shifts" audit.
- **Tool:** Lighthouse layout-shift audit; the shifted node was `main > div > section.mt-10` (the category and catalog sections).
- **Root cause:** The Signature Edit returned `null` until its four products arrived and the category row was empty until categories loaded. When the data came, both sections grew and moved everything below them.
- **Fix:** Both sections render immediately with placeholders of their final size (skeleton product cards and category tiles), and the showcase images have width and height. CLS went back to 0 (mobile) and 0.018 (desktop).
- **Fix (commit):** [e413d2b feat: restore storefront home sections with lightweight requests](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/e413d2b)
- **What I learned:** A component that renders nothing while loading still causes layout shift when it appears; reserve the space instead.

## 15. Profile details broke the description-list structure

- **Symptom:** After the Profile page was added to the compatibility matrix, axe failed on all six browser projects with `definition-list` and `dlitem` violations.
- **Reproduction:** `npx playwright test -c playwright.compat.config.ts -g "matrix: profile"`.
- **Tool:** axe-core through Playwright (`@axe-core/playwright`), WCAG 2.1 A/AA rules.
- **Root cause:** Each detail (member since, city, email, phone) placed an icon `span` and a `div` holding `dt`/`dd` inside the `dl`. A `dl` may only contain `dt`/`dd` groups, so screen readers could not pair labels with values.
- **Fix:** The details are now a labelled list (`ul` / `li`) with the label and value as text, which keeps the icon layout and is valid markup. axe reports no violations on Profile.
- **Fix (commit):** [5281e49 fix: use a list for profile details so screen readers pair labels and values](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/5281e49)
- **What I learned:** Extending automated accessibility checks to every page finds issues that visual checks miss.

## 16. The live-site check failed although the site worked

- **Symptom:** `node scripts/qa-live.mjs` reported `desktop-shopping-flow` as FAIL: "waiting for getByRole('link', { name: 'View cart' })". Opening the deployed site by hand, the same flow worked.
- **Reproduction:** `node scripts/qa-live.mjs`, then read the error and `docs/compat/live/desktop-shopping-flow-failed.png`.
- **Tool:** Playwright error log and the failure screenshot.
- **Root cause:** The script still described the old interface: the "View cart" dialog (replaced by an "Added ✓" button), a "Login" button (now "Log In"), only four checkout fields (phone and postal code are now required) and a total without shipping.
- **Fix:** The script follows the current flow and expects the discounted price plus $10 shipping below $100. All six live checks pass; the old failure screenshots were removed.
- **Fix (commit):** [c0f55b5 test: check the dark theme with axe and bring the live checks up to date](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/c0f55b5)
- **What I learned:** When the interface changes, the tests that describe it have to change in the same commit, or a FAIL stops meaning a broken site.

## 17. Lighthouse scored the product page 0 on mobile

- **Symptom:** `node scripts/lighthouse-perf.mjs current` gave Product / mobile a performance score of 0, twice in a row; the other pages scored normally.
- **Reproduction:** run the script; in `docs/lighthouse/current/product-mobile.json` `runtimeError.code` is `NO_NAVSTART`.
- **Tool:** the Lighthouse JSON report (`runtimeError`) and a separate Lighthouse run of `/products/1` alone, which scored 89.
- **Root cause:** Lighthouse failed to record the page-load trace when it ran straight after the previous page in the same Chrome. The score of 0 meant "not measured", not a slow page.
- **Fix:** The script runs a page once more when `runtimeError` is set and stops with an error if it fails again, so a broken trace can no longer be reported as a score. The next run measured Product / mobile at 94.
- **Fix (commit):** [c0f55b5 test: check the dark theme with axe and bring the live checks up to date](https://github.com/maribostashvili-93/10x-Shop_Mariami_Bostashvili/commit/c0f55b5)
- **What I learned:** Check whether a tool actually measured something before trusting its number.

## 18. A second shopper saw the first shopper's profile and address

- **Symptom:** After user A saved a profile (or placed an order, which saves delivery details), logging out and signing in as user B showed A's name, email, phone and address on Profile and prefilled them in Checkout. Orders were already filtered per user, so the two layers disagreed.
- **Reproduction:** sign in as `alice`, save profile details, log out, sign in as `bob`, open `/profile` or `/checkout`.
- **Tool:** code review of `services/profileStorage.ts` and `context/AuthContext.tsx`, then the browser pane: `localStorage` inspection plus a log-out → log-in flow.
- **Root cause:** every profile was stored under one shared key, `shop_profile`, and logout did not touch it; Checkout also read that key directly with `readProfile()`.
- **Fix:** Profiles are stored per username under `shop_profiles`; `AuthProvider` loads the signed-in shopper's profile on login and resets it on logout, and Checkout prefills from that context profile. An old `shop_profile` is moved once to the user who was signed in and then deleted. Verified in the browser: `alice`'s data migrated, and `bob` saw none of it. `StorageService.clear()` now ignores disabled storage like `load()`/`save()` do.
- **Fix (commit):** `fix: keep each shopper's profile separate`
- **What I learned:** Everything personal must be keyed by the same owner; filtering one layer (orders) per user is not enough if another layer (profile) is shared.

## 19. "Clear local data" deleted other shoppers' orders, and Checkout saved details without asking

- **Symptom:** (1) Pressing "Clear local data" as one shopper also removed the orders and reviews of every other shopper in the same browser. (2) Every order silently copied the delivery address, phone and payment method into the profile.
- **Reproduction:** (1) save orders and reviews for `alice` and `bob`, sign in as `alice`, Profile → Settings → Clear local data, then inspect `shop_orders` / `shop_reviews`. (2) place an order and inspect `shop_profiles`.
- **Tool:** code review of `ProfileSettings.tsx`, `OrdersProvider.tsx` and `CheckoutPage.tsx`, then the browser pane with seeded `localStorage` for two users.
- **Root cause:** `clearOrders()` replaced the whole order list with `[]` and `reviewStorage.clear()` removed the whole review key; Checkout called `updateProfile` unconditionally after placing the order.
- **Fix:** `clearOrders()` keeps orders whose `username` is not the signed-in user, and `removeReviewsBy(username)` keeps other reviewers' reviews; the cart (shared by design) is still cleared. Checkout has a "Save these details to my profile" checkbox, unchecked by default, and updates the profile only when it is ticked. Verified in the browser: after clearing as `alice`, `bob`'s order and review remained; an order with the box unchecked left the profile empty, and with it ticked saved the address.
- **Fix (commit):** `fix: clear only the shopper's own data and ask before saving checkout details`
- **What I learned:** A "clear my data" action must use the same owner key as the data it shows, and saving personal details needs an explicit choice from the shopper.

## 20. "Back to catalog" lost the filters, and two compatibility tests broke

- **Symptom:** (1) The smoke test "product details back button returns to the catalog" failed in all four projects: from `/products?category=beauty`, "Back to catalog" opened the unfiltered `/products`. (2) The keyboard flow never reached the order confirmation in Chromium and Firefox. (3) The dark-theme axe scan failed once in WebKit mobile with a 4.13:1 contrast on the active bottom-nav item.
- **Reproduction:** `npx playwright test` and `npx playwright test --config=playwright.compat.config.ts` after `npm run build`.
- **Tool:** Playwright list/JSON reports, failure screenshots and the axe attachment in `docs/compat/results.json`; `git show c9bb440`.
- **Root cause:** (1) Commit `c9bb440` replaced the history-based back button with a fixed `<Link to="/products">`. (2) The test pressed Tab a fixed number of times to reach "Place order"; the payment method select and the new "Save these details" checkbox added tab stops, so Enter landed on the wrong control. (3) axe sampled the nav item during its `transition-colors` animation (`#b77bf6` on `#3d2676`); the final colours pass, and three single reruns passed.
- **Fix:** (1) The catalog remembers its current URL in `sessionStorage`; "Back to catalog" stays a real link to that URL (or `/products` if none), so it keeps the filters and also works when the product page was opened directly. The smoke test now looks for a link. (2) The keyboard test tabs to the "Place order" button by name. (3) The dark-theme test waits for running CSS animations to finish before scanning. Result: smoke 16 passed; compatibility 94 passed, 0 failed, 2 WebKit keyboard skips.
- **Fix (commit):** `fix: keep catalog filters on "Back to catalog" and refresh test evidence`
- **What I learned:** Tests that count keystrokes break whenever a form grows; target controls by their accessible name. Re-run the suites after every UI change instead of trusting an older green report.

## Debugging checklist

- Run `npm run typecheck` before investigating runtime behavior.
- Check the browser Console for runtime errors.
- Check Network status, request URL, and response payload for API issues.
- Use React DevTools to inspect props, context, and state.
- Reproduce the complete user flow instead of testing only isolated pages.
- Run `npm run build` before considering a fix complete.
