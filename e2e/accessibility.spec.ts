import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility: axe scans", () => {
  test("home page — zero violations", async ({ page }) => {
    await page.goto("/");
    // Landing page has no interactive elements that would fail axe
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("tracking page — zero violations", async ({ page }) => {
    await page.goto("/track/tr-12658");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("coach layout page — zero violations", async ({ page }) => {
    await page.goto("/coach/tr-12658");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("PNR page — zero violations", async ({ page }) => {
    await page.goto("/pnr");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
