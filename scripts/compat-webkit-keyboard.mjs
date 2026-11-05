import { webkit } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await webkit.launch();
try {
  const page = await browser.newPage();
  await page.setContent('<a href="#">Link</a><button>Button</button><input aria-label="Input">');
  const results = [];
  for (const key of ['Tab', 'Tab', 'Tab', 'Alt+Tab', 'Alt+Tab', 'Alt+Tab']) {
    await page.keyboard.press(key);
    results.push({ key, focused: await page.evaluate(() => document.activeElement.outerHTML) });
  }
  await writeFile('docs/compat/webkit-keyboard-baseline.json', JSON.stringify(results, null, 2));
  console.log(results);
} finally {
  await browser.close();
}
