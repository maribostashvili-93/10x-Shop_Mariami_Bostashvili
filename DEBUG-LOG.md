# Debug Log

This document records real issues found and fixed while building 10X Shop. The project uses the browser Console and Network panel, React DevTools, the TypeScript compiler, and production builds as debugging tools.

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

## Debugging checklist

- Run `npm run typecheck` before investigating runtime behavior.
- Check the browser Console for runtime errors.
- Check Network status, request URL, and response payload for API issues.
- Use React DevTools to inspect props, context, and state.
- Reproduce the complete user flow instead of testing only isolated pages.
- Run `npm run build` before considering a fix complete.
