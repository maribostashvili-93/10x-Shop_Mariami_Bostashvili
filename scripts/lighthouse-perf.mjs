// Usage: npm run build && node scripts/lighthouse-perf.mjs <label>
// Runs Lighthouse (performance, accessibility, best practices) against the
// production build on a local Vite preview server and saves reports to
// docs/lighthouse/<label>/.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';

const label = process.argv[2] ?? 'run';
const port = 4199;
const pages = [
  ['catalog', '/'],
  ['product', '/products/1'],
  ['cart', '/cart'],
];

await mkdir(`docs/lighthouse/${label}`, { recursive: true });
const server = await preview({ preview: { port, strictPort: true, host: '127.0.0.1' } });
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox'] });
const summary = [];

try {
  for (const mode of ['mobile', 'desktop']) {
    for (const [name, path] of pages) {
      const audit = () => lighthouse(`http://127.0.0.1:${port}${path}`, {
        port: chrome.port,
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        output: ['html', 'json'],
        ...(mode === 'desktop'
          ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttlingMethod: 'simulate' }
          : {}),
      });
      let run = await audit();
      // A broken trace (e.g. NO_NAVSTART) scores 0 without measuring anything; try that page once more.
      if (run?.lhr.runtimeError) {
        console.warn(`${name}/${mode}: ${run.lhr.runtimeError.code}, running again`);
        run = await audit();
      }
      if (!run) throw new Error(`Lighthouse returned no result for ${path}`);
      if (run.lhr.runtimeError) throw new Error(`${name}/${mode}: ${run.lhr.runtimeError.code}`);
      await writeFile(`docs/lighthouse/${label}/${name}-${mode}.html`, run.report[0]);
      await writeFile(`docs/lighthouse/${label}/${name}-${mode}.json`, run.report[1]);
      const { categories, audits } = run.lhr;
      const row = {
        page: name,
        mode,
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        lcp: audits['largest-contentful-paint'].displayValue,
        cls: audits['cumulative-layout-shift'].displayValue,
        tbt: audits['total-blocking-time'].displayValue,
      };
      summary.push(row);
      console.log(JSON.stringify(row));
    }
  }
  await writeFile(`docs/lighthouse/${label}/summary.json`, JSON.stringify(summary, null, 2));
} finally {
  await chrome.kill();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
