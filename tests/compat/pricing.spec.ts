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
    if (url.searchParams.get('select') === 'discountPercentage') {
      return route.fulfill({ json: { products: products.map((product) => ({ id: product.id, discountPercentage: product.discountPercentage ?? 0 })) } });
    }
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
  await page.goto('/products');
  const card = page.locator('main article.product-card').filter({ has: page.getByRole('heading', { name: 'Discounted thirty', exact: true }) });
  await expect(card.getByText('Sale price $30.00', { exact: true }).first()).toBeVisible();
  await expect(card.getByText('Original price $60.00', { exact: true }).first()).toBeVisible();
  await expect(card.getByText('−50%', { exact: true }).first()).toBeVisible();
});

test('pricing: sorting is requested from the API and kept in the URL history', async ({ page }) => {
  const requests = await mockApi(page);
  await page.goto('/products?q=Discounted');
  await expect(page.getByLabel('Find your next favorite')).toHaveValue('Discounted');
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

test('pricing: Best deals lists only products with 15% off or more', async ({ page }) => {
  const requests = await mockApi(page);
  await page.goto('/products');
  await page.getByRole('link', { name: /Best deals/ }).first().click();
  await expect(page).toHaveURL(/\/products\?deals=1$/);
  const titles = page.locator('main article.product-card').getByRole('heading', { level: 2 }).getByRole('link');
  await expect(titles).toHaveText(['Discounted thirty']);
  await expect(page.getByText('1 product with 15% off or more')).toBeVisible();
  expect(requests).toContain('/products?limit=12&skip=0&sortBy=discountPercentage&order=desc');
});

test('pricing: the cart advert reveals 10X10 and applies it', async ({ page }) => {
  await mockApi(page);
  await page.goto('/products/1');
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.goto('/cart');
  await page.getByRole('button', { name: 'Unlock a promo code' }).click();
  const advert = page.getByRole('dialog');
  await expect(advert.getByText(/Your code is coming up/)).toBeVisible();
  await expect(advert.getByText('10X10', { exact: true })).toBeVisible({ timeout: 6000 });
  await advert.getByRole('button', { name: 'Apply code' }).click();
  await expect(advert).toBeHidden();
  const summary = page.getByRole('complementary', { name: 'Order summary' });
  await expect(summary.getByText('Discount (10X10 −10%)').first()).toBeVisible();
});
