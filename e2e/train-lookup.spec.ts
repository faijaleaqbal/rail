import { test, expect } from "@playwright/test";

test.describe("F02: Train lookup by number/name", () => {
  test("search by number '12658' → shows Chennai Central Mail", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /train no/i }).click();
    await page.getByPlaceholder(/12658/).fill("12658");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/Chennai Central Mail/i)).toBeVisible();
  });

  test("search by name 'chennai' → shows match", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /train no/i }).click();
    await page.getByPlaceholder(/12658/).fill("chennai");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/Chennai/i).first()).toBeVisible();
  });

  test("empty query → error", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /train no/i }).click();
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/enter a train number/i)).toBeVisible();
  });

  test("non-existent '99999' → no match", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /train no/i }).click();
    await page.getByPlaceholder(/12658/).fill("99999");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/no train matched/i)).toBeVisible();
  });
});
