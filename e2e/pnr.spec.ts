import { test, expect } from "@playwright/test";

test.describe("F06: PNR status check", () => {
  test("valid PNR '1234567890' → see booking status", async ({ page }) => {
    await page.goto("/pnr");
    await page.getByPlaceholder(/10-digit PNR/i).fill("1234567890");
    await page.getByRole("button", { name: /check/i }).click();
    await expect(page.getByText(/booking status/i)).toBeVisible();
  });

  test("empty input → error", async ({ page }) => {
    await page.goto("/pnr");
    await page.getByRole("button", { name: /check/i }).click();
    await expect(page.getByText(/enter a 10-digit pnr/i)).toBeVisible();
  });

  test("short '123' → error", async ({ page }) => {
    await page.goto("/pnr");
    await page.getByPlaceholder(/10-digit PNR/i).fill("123");
    await page.getByRole("button", { name: /check/i }).click();
    await expect(page.getByText(/exactly 10 digits/i)).toBeVisible();
  });

  test("non-numeric input stripped", async ({ page }) => {
    await page.goto("/pnr");
    const input = page.getByPlaceholder(/10-digit PNR/i);
    await input.fill("abc123");
    await expect(input).toHaveValue("123");
  });
});
