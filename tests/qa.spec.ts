import { test, expect } from "@playwright/test";

test.describe("10X Shop smoke coverage", () => {
  test("unknown route shows recovery page", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });

  test("product details back link returns to catalog", async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.getByRole("link", { name: /back to products/i })).toHaveAttribute("href", "/products");
  });

  test("guest checkout redirects to login", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("login rejects a short password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill("qa-user");
    await page.getByLabel("Password").fill("12345");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });
});
