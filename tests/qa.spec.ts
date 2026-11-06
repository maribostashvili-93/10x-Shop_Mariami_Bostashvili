import { test, expect } from "@playwright/test";

test.describe("10X Shop smoke coverage", () => {
  test("unknown route shows recovery page", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expect(page.getByRole("link", { name: "Go to catalog" })).toHaveAttribute("href", "/products");
  });

  test("product details back button returns to the catalog", async ({ page }) => {
    await page.goto("/products?category=beauty");
    await page.locator("main article.product-card h2 a").first().click();
    await expect(page).toHaveURL(/\/products\/\d+$/);
    // A real link (not history.back), so it also works when the product page was opened directly.
    await page.getByRole("link", { name: /back to catalog/i }).click();
    await expect(page).toHaveURL(/\/products\?category=beauty$/);
  });

  test("guest checkout redirects to login", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("login rejects a short password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill("qa-user");
    await page.getByLabel("Password").fill("12345");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });
});
