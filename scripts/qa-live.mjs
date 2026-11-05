import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.QA_LIVE_URL ?? 'https://10x-shop-mariami-bostashvili-mt61.vercel.app';
const results = { startedAt: new Date().toISOString(), baseURL, browser: 'Chromium', api: 'real network; no interception', checks: [], networkFailures: [] };
await mkdir('docs/compat/live', { recursive: true });
const browser = await chromium.launch();

async function check(name, viewport, action) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(40000);
  page.on('requestfailed', request => results.networkFailures.push({ check: name, url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => {
    if (response.status() >= 400) results.networkFailures.push({ check: name, url: response.url(), status: response.status() });
  });
  try {
    const detail = await action(page);
    const screenshot = `docs/compat/live/${name}.png`;
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    results.checks.push({ name, status: 'PASS', viewport, screenshot, detail });
  } catch (error) {
    const screenshot = `docs/compat/live/${name}-failed.png`;
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' }).catch(() => {});
    const unavailable = results.networkFailures.some(failure => failure.check === name && failure.status >= 400 && failure.url.startsWith(baseURL));
    results.checks.push({ name, status: unavailable && /guest|shopping-flow/.test(name) ? 'BLOCKED' : 'FAIL', viewport, screenshot, error: String(error.message) });
  } finally {
    await context.close();
  }
  console.log(JSON.stringify(results.checks.at(-1)));
}

try {
  await check('desktop-home-availability', { width: 1440, height: 900 }, async page => {
    const response = await page.goto(baseURL);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: '10X Shop', exact: true })).toBeVisible();
    return { httpStatus: response.status(), url: page.url() };
  });
  await check('desktop-product-deep-link-refresh', { width: 1440, height: 900 }, async page => {
    const response = await page.goto(`${baseURL}/products/5`);
    expect(response.status()).toBe(200);
    const heading = page.getByRole('main').getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).not.toHaveText(/not found/i);
    await expect(page.getByRole('main').getByRole('button', { name: 'Add to cart', exact: true })).toBeVisible();
    const title = await heading.textContent();
    await page.reload();
    await expect(heading).toHaveText(title);
    return { httpStatus: response.status(), title, url: page.url(), reload: 'PASS' };
  });
  await check('desktop-guest-checkout-refresh', { width: 1440, height: 900 }, async page => {
    const response = await page.goto(`${baseURL}/checkout`);
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/\/login$/);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
    return { redirectedTo: page.url(), reload: 'PASS' };
  });
  await check('desktop-shopping-flow', { width: 1440, height: 900 }, async page => {
    const response = await page.goto(baseURL);
    expect(response.status()).toBe(200);
    await page.locator('header a[href="/products"]').first().click();
    const productLink = page.locator('main article.product-card').getByRole('heading', { level: 2 }).getByRole('link').first();
    await expect(productLink).toBeVisible();
    const title = await productLink.textContent();
    const productResponse = page.waitForResponse(response => /^https:\/\/dummyjson\.com\/products\/\d+$/.test(response.url()) && response.ok());
    await productLink.click();
    const productData = await (await productResponse).json();
    await page.getByRole('main').getByRole('button', { name: 'Add to cart', exact: true }).click();
    await page.getByRole('link', { name: 'View cart', exact: true }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await page.getByRole('link', { name: 'Proceed to checkout' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel('Username', { exact: true }).fill('qa-live-demo');
    await page.getByLabel('Password', { exact: true }).fill('demo-password');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Complete your order' })).toBeVisible();
    await expect(page.getByText('Enter your details to place this local demo order.', { exact: true })).toBeVisible();
    const summary = await page.locator('main aside').innerText();
    await page.screenshot({ path: 'docs/compat/live/desktop-checkout.png', fullPage: true, animations: 'disabled' });
    const expectedTotal = (Math.round(productData.price * (1 - (productData.discountPercentage ?? 0) / 100) * 100) / 100).toFixed(2);
    const actualTotal = summary.match(/\nTotal\n\$(\d+\.\d+)/)?.[1];
    results.checks.push({ name: 'live-discount-consistency', status: actualTotal === expectedTotal ? 'PASS' : 'FAIL', screenshot: 'docs/compat/live/desktop-checkout.png', detail: { title, price: productData.price, discountPercentage: productData.discountPercentage, expectedTotal, actualTotal } });
    for (const [label, value] of [['Full name', 'QA Test Customer'], ['Email', 'qa@example.com'], ['Address', '10 Test Street'], ['City', 'Tbilisi']]) {
      await page.getByLabel(label, { exact: false }).fill(value);
    }
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order' })).toBeVisible();
    await page.screenshot({ path: 'docs/compat/live/desktop-confirmation.png', fullPage: true, animations: 'disabled' });
    await page.getByRole('link', { name: 'Continue shopping', exact: true }).click();
    await page.getByRole('link', { name: 'Shopping bag', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your cart is empty', exact: true })).toBeVisible();
    return { title, summary, confirmation: 'PASS', clearedCart: 'PASS', checkout: 'local demo simulation; no real payment' };
  });
  await check('mobile-product-deep-link-refresh', { width: 375, height: 812 }, async page => {
    const response = await page.goto(`${baseURL}/products/5`);
    expect(response.status()).toBe(200);
    const heading = page.getByRole('main').getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).not.toHaveText(/not found/i);
    await expect(page.getByRole('main').getByRole('button', { name: 'Add to cart', exact: true })).toBeVisible();
    const title = await heading.textContent();
    await page.reload();
    await expect(heading).toHaveText(title);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    expect(overflow).toBe(false);
    return { title, reload: 'PASS', horizontalOverflow: overflow };
  });
} finally {
  await browser.close();
  results.finishedAt = new Date().toISOString();
  await writeFile('docs/compat/live-results.json', JSON.stringify(results, null, 2));
}
if (results.checks.some(check => check.status !== 'PASS')) process.exitCode = 1;
