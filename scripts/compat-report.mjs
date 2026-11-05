import { readFile, writeFile, readdir } from 'node:fs/promises';
const version = async (name) => JSON.parse(await readFile(`node_modules/${name}/package.json`, 'utf8')).version;

const report = JSON.parse(await readFile('docs/compat/results.json', 'utf8'));
const rows = [];
function visit(suites) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const result = test.results.at(-1);
        const violations = [];
        for (const attachment of result.attachments ?? []) {
          if (['axe', 'checkout-axe'].includes(attachment.name)) {
            const json = attachment.body ? Buffer.from(attachment.body, 'base64').toString('utf8') : null;
            if (json) violations.push(...JSON.parse(json));
          }
        }
        rows.push({ name: spec.title, project: test.projectName, status: result.status, errors: result.errors.map(e => e.message).join('\n').replace(/\u001b\[[0-9;]*m/g, ''), violations });
      }
    }
    visit(suite.suites);
  }
}
visit(report.suites);
const projects = [...new Set(rows.map(r => r.project))];
const names = [...new Set(rows.map(r => r.name))];
let md = '# Compatibility — 10X Shop\n\n';
md += `Run started (UTC): ${report.stats.startTime}. Duration: ${(report.stats.duration / 1000).toFixed(1)} seconds. Local production build: http://127.0.0.1:4173. Desktop: 1440×900; Mobile: 390×844. Chromium, Firefox, and WebKit are Playwright browser engines; branded Chrome/Firefox/Safari applications and physical phones were not tested. Firefox Mobile uses viewport and touch emulation only.\n\n`;
md += 'Playwright tests replace DummyJSON responses with one fixed product (QA Beauty Product), using favicon.svg as its image. This verifies the UI and shopping flow but does not verify the live API or real product images. Lighthouse uses real network requests; its results apply to the state displayed during each run.\n\n';
md += `Tests: ${rows.filter(r => r.status === 'passed').length} passed, ${rows.filter(r => r.status === 'failed' || r.status === 'timedOut').length} failed, ${rows.filter(r => r.status === 'skipped').length} skipped. FAIL includes axe violations and does not always indicate a broken page or keyboard flow.\n\n`;
md += '## Testing Tools and Methodology\n\n';
md += `- **Playwright Test ${await version('@playwright/test')}**: automated browser tests against the Vite production build, using six projects (three engines × Desktop/Mobile). Two workers, no retries, and a 60-second timeout per test.\n`;
md += `- **@axe-core/playwright ${await version('@axe-core/playwright')}**: automated accessibility scans with WCAG 2.0/2.1 Level A and AA tags (wcag2a, wcag2aa, wcag21a, wcag21aa). Scans run on the five page states and on checkout when the keyboard flow reaches it.\n`;
md += `- **Lighthouse ${await version('lighthouse')}**: Accessibility-only audits of Catalog and Login in Desktop and Mobile modes, using Playwright Chromium. Performance, SEO, and Best Practices were not measured in this run.\n`;
md += '- **Functional smoke testing**: verify page headings, product navigation, add-to-cart, guest checkout redirect, login return navigation, delivery form submission, and order confirmation. This suite does not exhaustively test prices, stock boundaries, form errors, or persistence.\n';
md += '- **Responsive layout checks**: compare document scroll width with viewport width (1px tolerance) on the five matrix pages. Capture full-page screenshots with animations disabled. Screenshots are evidence, not automated pixel-diff visual regression tests.\n';
md += '- **Keyboard end-to-end testing**: reach controls through Tab and activate them with Enter; enter credentials and delivery data through keyboard typing. Targets are located using accessible roles and labels. The test fails if a target remains unreachable after 180 Tab presses.\n';
md += '- **Repeatability and evidence**: intercept DummyJSON requests with a deterministic fixture, isolate each test in a browser context, retain traces/screenshots on failure, and produce HTML/JSON reports. These are automated browser checks; they are not manual screen-reader testing or certification of WCAG compliance.\n\n';
md += '## Page × Browser × Device\n\n';
md += '| Scenario | ' + projects.join(' | ') + ' |\n| --- | ' + projects.map(() => '---').join(' | ') + ' |\n';
for (const name of names) md += '| ' + name + ' | ' + projects.map(p => { const r = rows.find(r => r.name === name && r.project === p); return r?.status === 'passed' ? 'PASS' : r?.status === 'failed' ? 'FAIL' : r?.status ?? 'NOT TESTED'; }).join(' | ') + ' |\n';
md += '\nThe matrix covers Catalog, Product Details, empty Cart, Login, 404, and populated Cart/Checkout/Confirmation within the shopping flow. Home, Journal, Wishlist, Profile, and supporting pages are outside the scope of this run.\n\n';
const supplementalPath = 'docs/compat/firefox-recheck.json';
try {
  const supplemental = JSON.parse(await readFile(supplementalPath, 'utf8'));
  md += `## Isolated Firefox Recheck\n\nThe main run timed out on the Firefox Desktop 404 scenario and reported a browser-context protocol error during cleanup. An isolated recheck started at ${supplemental.stats.startTime}: ${supplemental.stats.expected} passed, ${supplemental.stats.unexpected} failed, ${supplemental.stats.skipped} skipped. The page loaded and the overflow check completed; the remaining failure was the header label-content-name-mismatch axe assertion. The protocol timeout did not recur in this isolated run and is not confirmed as an application defect. This supplemental result does not replace the main matrix. Evidence: [firefox-recheck.json](${supplementalPath}) and docs/compat/recheck-artifacts/.\n\n`;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
md += '## Confirmed Accessibility Findings\n\n';
const findings = new Map();
for (const row of rows) for (const violation of row.violations) {
  if (!findings.has(violation.id)) findings.set(violation.id, { help: violation.help, impact: violation.impact, projects: new Set(), samples: new Set() });
  const finding = findings.get(violation.id);
  finding.projects.add(row.project);
  for (const node of violation.nodes) finding.samples.add(node.html);
}
for (const [id, finding] of findings) {
  md += `- **${id}** (${finding.impact}): ${finding.help}. Observed in ${[...finding.projects].join(', ')}.\n`;
  md += '  Example affected elements:\n\n';
  for (const sample of [...finding.samples].slice(0, 4)) md += `  - \`${sample.replaceAll('`', '')}\`\n`;
  md += '\n';
}
if (!findings.size) md += '- No violations were recorded in the available axe attachments.\n';
md += '- Exact failure reasons and selectors are recorded in `docs/compat/report/index.html`, `results.json`, and `artifacts/`.\n\n';
md += '## Keyboard Navigation\n\nThe shopping flow uses Tab, Enter, and keyboard typing: Catalog → Product → Add to cart → View cart → Checkout → Login → Return to checkout → Complete all four fields → Place order → Confirmation. No click/focus/fill actions are used to complete this flow. When the only keyboard test error is an axe assertion, the flow reached confirmation and the FAIL refers to accessibility. This is not a complete assessment of every dropdown, focus trap, Shift+Tab interaction, or screen reader.\n\n';
md += '| Engine | Desktop keyboard flow | Mobile keyboard flow |\n| --- | --- | --- |\n';
function keyboardStatus(project) {
  const row = rows.find(r => r.project === project && r.name.startsWith('keyboard:'));
  if (!row) return 'NOT TESTED';
  if (row.status === 'passed') return 'PASS';
  if (row.errors.includes('Keyboard target unreachable')) return 'BLOCKED: keyboard target unreachable';
  if (row.violations.length && row.errors.includes('toEqual(expected)')) return 'PASS flow (separate axe FAIL)';
  return row.status.toUpperCase();
}
for (const engine of ['chromium', 'firefox', 'webkit']) md += `| ${engine} | ${keyboardStatus(engine + '-desktop')} | ${keyboardStatus(engine + '-mobile')} |\n`;
md += '\n';
md += 'The WebKit control experiment uses plain `<a>`, `<button>`, and `<input>` elements. Tab/Alt+Tab reaches only the button and input, skipping the link even without the application. Evidence: `docs/compat/webkit-keyboard-baseline.json`; reproduce with `node scripts/compat-webkit-keyboard.mjs`. This indicates a limitation of the test environment keyboard-navigation mode and is not classified as an application defect. A retest in real Safari with keyboard navigation enabled is required. Full keyboard compliance therefore remains unverified.\n\n';
md += '## Lighthouse Accessibility\n\n| Page | Desktop | Mobile |\n| --- | --- | --- |\n';
for (const page of ['catalog', 'login']) {
  const scores = [];
  for (const mode of ['desktop', 'mobile']) {
    const r = JSON.parse(await readFile(`docs/compat/lighthouse/${page}-${mode}.json`, 'utf8'));
    scores.push(`${Math.round(r.categories.accessibility.score * 100)}/100`);
  }
  md += `| ${page} | ${scores.join(' | ')} |\n`;
}
md += '\nA score of 100 does not establish full WCAG compliance. Lighthouse and axe use different scoring and audits. The table below lists failed Lighthouse audits independently of each score. Reports: `docs/compat/lighthouse/*.html` and `*.json`. Lighthouse Mobile uses its default mobile viewport.\n\n';
for (const page of ['catalog', 'login']) for (const mode of ['desktop', 'mobile']) {
  const r = JSON.parse(await readFile(`docs/compat/lighthouse/${page}-${mode}.json`, 'utf8'));
  const failures = Object.values(r.audits).filter(a => a.score === 0).map(a => a.id);
  md += `- ${page} / ${mode}: captured ${r.fetchTime}; failed audits: ${failures.join(', ') || 'none'}; run warnings: ${r.runWarnings?.join('; ') || 'none'}.\n`;
}
md += '\n';
md += '## Screenshots\n\n';
for (const f of (await readdir('docs/compat')).filter(f => f.endsWith('.png'))) md += `- [${f}](docs/compat/${f})\n`;
md += '\n## Reproducing the Results\n\n```bash\nnpm run build\nnode node_modules/@playwright/test/cli.js test --config=playwright.compat.config.ts\n# The preview server must be running for Lighthouse:\nnode scripts/compat-lighthouse.mjs\nnode scripts/compat-report.mjs\n```\n';
await writeFile('COMPATIBILITY.md', md);
console.log(JSON.stringify(rows.map(({name,project,status,errors}) => ({name,project,status,error:errors.slice(0,200)})),null,2));
