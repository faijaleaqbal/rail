import { test, expect } from "@playwright/test";

test.describe("F05: Coach & seat layout", () => {
  test("navigate to /coach/tr-12658 → see rake strip", async ({ page }) => {
    await page.goto("/coach/tr-12658");
    await expect(page.getByText(/Rake Order/i)).toBeVisible();
  });

  test("see 7 coaches in rake", async ({ page }) => {
    await page.goto("/coach/tr-12658");
    const rake = page.getByRole("list");
    await expect(rake.getByRole("listitem")).toHaveCount(7);
  });

  test("see berth grid with seats", async ({ page }) => {
    await page.goto("/coach/tr-12658");
    const grid = page.getByRole("grid");
    await expect(grid).toBeVisible();
    await expect(grid.getByRole("gridcell").first()).toBeVisible();
  });

  test("invalid train ID → not available message", async ({ page }) => {
    await page.goto("/coach/invalid-id");
    await expect(page.getByText(/coach layout not available/i)).toBeVisible();
  });
});
