import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/compat/lighthouse', { recursive: true });
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox'] });
try {
  for (const mode of ['desktop', 'mobile']) {
    for (const [name, path] of [['catalog', '/products'], ['login', '/login']]) {
      const run = await lighthouse(`http://127.0.0.1:4173${path}`, {
        port: chrome.port,
        onlyCategories: ['accessibility'],
        output: ['html', 'json'],
        ...(mode === 'desktop' ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } } : {}),
      });
      await writeFile(`docs/compat/lighthouse/${name}-${mode}.html`, run.report[0]);
      await writeFile(`docs/compat/lighthouse/${name}-${mode}.json`, run.report[1]);
      console.log(JSON.stringify({ name, mode, score: run.lhr.categories.accessibility.score, finalUrl: run.lhr.finalDisplayedUrl, warnings: run.lhr.runWarnings }));
    }
  }
} finally {
  await chrome.kill();
}
