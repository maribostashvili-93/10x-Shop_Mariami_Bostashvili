# 10X Shop — agent contract

## Before changing code

1. Read `STYLE_GUIDE.md` for UI work and the relevant PRD/Appendix A requirement.
2. Inspect the existing component, route, test and documentation references.
3. Keep the change within CORE scope unless FULL/BONUS work is explicitly requested.

## UI rules

- Use Tailwind CSS v4 and existing project tokens.
- Keep the violet storefront visual system consistent in light and dark themes.
- Use semantic HTML, visible labels, keyboard focus, useful loading/error/empty states and meaningful image `alt` text.
- Do not use emoji as interface icons or decoration; use accessible SVG icons.
- Check mobile widths, desktop layout and horizontal overflow after UI changes.

## QA agent roles

- **Implementation agent:** changes code, runs focused checks and documents the change.
- **QA tester agent:** independently audits the result without modifying files. It verifies build/typecheck/lint, smoke flow, Playwright compatibility/pricing tests, responsive behavior, accessibility and evidence consistency.
- QA findings must distinguish `PASS`, `FAIL`, `UNVERIFIED` and environment limitations. Never call an old report current without rerunning it.

## Required checks

Run these after meaningful changes:

```text
npm run typecheck
npm run lint
npm run build
```

For browser verification use the existing `playwright.config.ts` and `playwright.compat.config.ts`. If a suite depends on a live API, record that limitation; deterministic mock tests and live-network tests must not be presented as the same evidence.

## Bug and evidence rules

- Record real defects in `DEBUG-LOG.md`: symptom, reproduction, evidence/tool, root cause, fix and lesson learned.
- `COMPATIBILITY.md` is the generated browser/device matrix; do not manually claim a result that was not generated or rerun.
- Keep test counts, timestamps, browser status and report links synchronized.
- Do not invent features, test results, deployment status or credentials.

## Documentation map

- `PLAN.md` — full plan and completed/remaining work.
- `DEBUG-LOG.md` — debugging history plus consolidated QA findings.
- `REPORT.md` — final PRD/completion report.
- `COMPATIBILITY.md` — generated compatibility evidence.
