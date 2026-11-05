import { test, expect } from '@playwright/test';

const base = { description: 'Pricing regression fixture', category: 'beauty', rating: 4.5, stock: 5, thumbnail: '/favicon.svg' };
const products = [
  { ...base, id: 1, title: 'Discounted thirty', price: 60, discountPercentage: 50 },
  { ...base, id: 2, title: 'Regular forty', price: 40 },
  { ...base, id: 3, title: 'Discounted fifty', price: 100, discountPercentage: 50 },
  { ...base, id: 4, title: 'Discounted hundred', price: 200, discountPercentage: 50 },
  { ...base, id: 5, title: 'Over hundred', price: 101 },
  { ...base, id: 6, title: 'Rounded fifty', price: 55.55, discountPercentage: 10 },
];

test.beforeEach(async ({ page }) => {
  await page.route('https://dummyjson.com/**', route => route.fulfill({
    json: new URL(route.request().url()).pathname.endsWith('/categories')
      ? [{ slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' }]
      : { products, total: products.length, skip: 0, limit: products.length },
  }));
});

for (const [query, expected] of [
  ['price=under-50', ['Discounted thirty', 'Regular forty']],
  ['price=50-100', ['Discounted fifty', 'Discounted hundred', 'Rounded fifty']],
  ['price=over-100', ['Over hundred']],
  ['sort=price-asc', ['Discounted thirty', 'Regular forty', 'Discounted fifty', 'Rounded fifty', 'Discounted hundred', 'Over hundred']],
  ['sort=price-desc', ['Over hundred', 'Discounted hundred', 'Discounted fifty', 'Rounded fifty', 'Regular forty', 'Discounted thirty']],
] as const) {
  test(`pricing: displayed final price drives ${query}`, async ({ page }) => {
    await page.goto(`/products?${query}`);
    const cards = page.locator('main article.product-card');
    await expect(cards.getByRole('heading', { level: 2 }).getByRole('link')).toHaveText([...expected]);
    if (query === 'price=under-50') {
      await expect(cards.filter({ has: page.getByRole('heading', { name: 'Discounted thirty', exact: true }) }).getByText('Sale price $30.00', { exact: true }).first()).toBeVisible();
    }
    await page.reload();
    await expect(cards.getByRole('heading', { level: 2 }).getByRole('link')).toHaveText([...expected]);
  });
}

test('pricing: filter changes preserve search and sort through browser history', async ({ page }) => {
  await page.goto('/products?q=Discounted&sort=price-asc');
  const titles = page.locator('main article.product-card').getByRole('heading', { level: 2 }).getByRole('link');
  await expect(titles).toHaveText(['Discounted thirty', 'Discounted fifty', 'Discounted hundred']);
  await page.getByLabel('Price range').selectOption('under-50');
  await page.getByRole('main').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(titles).toHaveText(['Discounted thirty']);
  await expect(page).toHaveURL(/q=Discounted/);
  await expect(page).toHaveURL(/sort=price-asc/);
  await page.goBack();
  await expect(titles).toHaveText(['Discounted thirty', 'Discounted fifty', 'Discounted hundred']);
  await page.goForward();
  await expect(titles).toHaveText(['Discounted thirty']);
});
