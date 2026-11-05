import { test, expect, type Page } from '@playwright/test';

const base = { description: 'Pricing regression fixture', category: 'beauty', rating: 4.5, stock: 5, thumbnail: '/favicon.svg' };
const products = [
  { ...base, id: 1, title: 'Discounted thirty', price: 60, discountPercentage: 50 },
  { ...base, id: 2, title: 'Regular forty', price: 40 },
  { ...base, id: 3, title: 'Rounded fifty', price: 55.55, discountPercentage: 10 },
];

/** Records every catalog request so tests can check the query sent to DummyJSON. */
async function mockApi(page: Page) {
  const requests: string[] = [];
  await page.route('https://dummyjson.com/**', (route) => {
    const url = new URL(route.request().url());
    requests.push(`${url.pathname}${url.search}`);
    const match = url.pathname.match(/^\/products\/(\d+)$/);
    const body = url.pathname.endsWith('/categories')
      ? [{ slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' }]
      : match
        ? products.find((product) => product.id === Number(match[1]))
        : { products, total: products.length, skip: 0, limit: 12 };
    return route.fulfill({ json: body });
  });
  return requests;
}

test('pricing: cards show the discounted price, original price and badge', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  const card = page.locator('main article.product-card').filter({ has: page.getByRole('heading', { name: 'Discounted thirty', exact: true }) });
  await expect(card.getByText('Sale price $30.00', { exact: true }).first()).toBeVisible();
  await expect(card.getByText('Original price $60.00', { exact: true }).first()).toBeVisible();
  await expect(card.getByText('−50%', { exact: true }).first()).toBeVisible();
});

test('pricing: sorting is requested from the API and kept in the URL history', async ({ page }) => {
  const requests = await mockApi(page);
  await page.goto('/?q=Discounted');
  await expect(page.getByLabel('Search', { exact: true })).toHaveValue('Discounted');
  await page.getByLabel('Sort by').selectOption('price-asc');
  await expect(page).toHaveURL(/q=Discounted&sort=price-asc/);
  await expect.poll(() => requests.at(-1)).toContain('/products/search?q=Discounted&limit=12&skip=0&sortBy=price&order=asc');
  await page.goBack();
  await expect(page.getByLabel('Sort by')).toHaveValue('');
  await page.goForward();
  await expect(page.getByLabel('Sort by')).toHaveValue('price-asc');
});

test('pricing: cart adds $10 shipping below $100 and applies 10X10', async ({ page }) => {
  await mockApi(page);
  await page.goto('/products/1');
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.goto('/cart');
  const summary = page.getByRole('complementary', { name: 'Order summary' });
  await expect(summary.getByText('$10.00', { exact: true })).toBeVisible();
  await expect(summary.getByText('$40.00', { exact: true })).toBeVisible();
  await page.getByLabel('Promo code').fill('abc');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Invalid promo code')).toBeVisible();
  await page.getByLabel('Promo code').fill('10x10');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(summary.getByText('Discount (10X10 −10%)').first()).toBeVisible();
  await expect(summary.getByText('$37.00', { exact: true })).toBeVisible();
});
