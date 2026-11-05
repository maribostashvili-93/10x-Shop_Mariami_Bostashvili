import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const product = { id: 1, title: 'QA Beauty Product', description: 'Deterministic compatibility fixture', category: 'beauty', price: 25, rating: 4.5, stock: 5, discountPercentage: 10, thumbnail: '/favicon.svg' };

test.beforeEach(async ({ page }) => {
  await page.route('https://dummyjson.com/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const body = path.endsWith('/categories') ? [{ slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' }] : path === '/products/1' ? product : { products: [product], total: 1, skip: 0, limit: 1 };
    await route.fulfill({ json: body });
  });
});

async function capture(page: Page, name: string, project: string) {
  await page.screenshot({ path: `docs/compat/current/${project}-${name}.png`, fullPage: true, animations: 'disabled' });
}

async function tabTo(page: Page, target: Locator, key: 'Tab' | 'Shift+Tab' = 'Tab') {
  // Lazy-loaded routes render a short fallback first; wait for the real control like a user would.
  await target.waitFor({ state: 'visible' });
  for (let i = 0; i < 180; i++) {
    await page.keyboard.press(key);
    if (await target.evaluate(el => el === document.activeElement)) return;
  }
  throw new Error('Keyboard target unreachable after 180 Tab presses');
}

// [name, path, a heading that proves the page rendered, needs a signed-in shopper]
const MATRIX: readonly (readonly [string, string, string, boolean])[] = [
  ['home', '/', 'All products', false],
  ['catalog', '/products', 'Catalog', false],
  ['best-deals', '/products?deals=1', 'Catalog', false],
  ['product', '/products/1', 'QA Beauty Product', false],
  ['cart-empty', '/cart', 'Your cart is empty.', false],
  ['login', '/login', 'Login', false],
  ['orders', '/orders', 'My orders', true],
  ['profile', '/profile', 'compat-user', true],
  ['not-found', '/missing-compat-route', 'Page not found', false],
];

for (const [name, path, heading, signedIn] of MATRIX) {
  test(`matrix: ${name}`, async ({ page }, info) => {
    if (signedIn) {
      // Local demo login: only the username is stored, exactly as the Login page does.
      await page.addInitScript(() => localStorage.setItem('shop_user', JSON.stringify({ username: 'compat-user' })));
    }
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await capture(page, name, info.project.name);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await info.attach('axe', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'horizontal overflow').toBe(true);
    expect.soft(results.violations, 'WCAG A/AA axe violations').toEqual([]);
  });
}

test('keyboard: catalog → product → cart → login → checkout → confirmation', async ({ page, browserName }, info) => {
  test.skip(
    browserName === 'webkit',
    'Playwright WebKit never moves focus to links with Tab or Alt+Tab, even on a bare <a href> page (docs/compat/webkit-keyboard-baseline.json). Check this flow in real Safari with "Press Tab to highlight each item" enabled.',
  );
  await page.goto('/products');
  // The mocked API returns one product everywhere, so target the card inside the Catalog section.
  const productLink = page.getByRole('region', { name: 'Catalog' }).getByRole('heading', { name: product.title, exact: true }).getByRole('link');
  await tabTo(page, productLink);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: product.title, exact: true })).toBeVisible();
  await tabTo(page, page.getByRole('button', { name: 'Add to cart', exact: true }));
  await page.keyboard.press('Enter');
  // The button now confirms with "Added ✓" (no dialog); continue through the header Cart link.
  await expect(page.getByRole('button', { name: 'Added ✓' })).toBeVisible();
  // The header is above the button, so go back with Shift+Tab (Firefox does not wrap forward Tab to the top).
  await tabTo(page, page.getByRole('banner').getByRole('link', { name: /^Cart/ }), 'Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/cart$/);
  await capture(page, 'cart-populated', info.project.name);
  await tabTo(page, page.getByRole('link', { name: 'Proceed to checkout' }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/login$/);
  await tabTo(page, page.getByLabel('Username', { exact: true }));
  await page.keyboard.type('compat-user');
  await page.keyboard.press('Tab');
  await page.keyboard.type('demo-password');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Complete your order' })).toBeVisible();
  await capture(page, 'checkout', info.project.name);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  await info.attach('checkout-axe', { body: JSON.stringify(axe.violations, null, 2), contentType: 'application/json' });
  await tabTo(page, page.getByLabel('Full name', { exact: false }));
  // Full name is pre-filled with the username, so each field is selected before typing.
  for (const value of ['QA Customer', 'qa@example.com', '+995 555 123 456', '10 Test Street', 'Tbilisi', '0101']) {
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type(value);
    await page.keyboard.press('Tab');
  }
  // Country keeps its default (Georgia); one more Tab reaches "Place order".
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Thank you! Your order has been placed.' })).toBeVisible();
  await capture(page, 'confirmation', info.project.name);
  expect.soft(axe.violations).toEqual([]);
});
