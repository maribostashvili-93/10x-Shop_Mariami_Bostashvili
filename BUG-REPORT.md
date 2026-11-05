# Bug Report — 10X Shop

## BUG-001 — Product details back link goes to home instead of catalog

- Severity: Low
- Status: Confirmed by source inspection; browser replay pending
- Location: `src/pages/ProductPage.tsx` (the link labelled “Back to products”)
- Steps: Open any `/products/:id` page and activate “Back to products”.
- Expected: Navigate to `/products`.
- Actual: The link target is `/`.
- Root cause: The JSX uses a home route for a control whose label promises catalog navigation.
- Suggested fix: Change the target to `/products` and add a Playwright assertion.
- Screenshot/trace: Not available; no browser trace was generated.

## BUG-002 — Password minimum length is not enforced

- Severity: Medium
- Status: Confirmed by source inspection; browser replay pending
- Location: `src/pages/LoginPage.tsx`
- Steps: Submit a non-empty username with a password of 1–5 characters.
- Expected: Validation error if the project requirement is a six-character minimum.
- Actual: The form accepts any non-empty password and logs the user in.
- Root cause: `handleSubmit` checks only `!username.trim() || !password.trim()`.
- Suggested fix: Add a minimum-length validation rule and an associated accessible error message, after confirming the PRD requirement.
- Screenshot/trace: Not available; no browser trace was generated.

## Non-bugs / not classified

- Cart persistence is not classified as a bug because the current documentation does not promise cart persistence.
- Lighthouse scores, browser differences, API outage behavior, and responsive overflow remain unverified rather than reported as defects.
