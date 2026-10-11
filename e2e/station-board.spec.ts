import { test, expect } from "@playwright/test";

test.describe("F03: Station departure board", () => {
  test("search 'Guwahati' → shows departures", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /station board/i }).click();
    await page.getByPlaceholder(/guwahati/i).fill("Guwahati");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/upcoming departures/i)).toBeVisible();
  });

  test("empty query → error", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /station board/i }).click();
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/station not found/i)).toBeVisible();
  });

  test("search 'Delhi' → shows New Delhi departures", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("tab", { name: /station board/i }).click();
    await page.getByPlaceholder(/guwahati/i).fill("Delhi");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/New Delhi/i)).toBeVisible();
  });
});
