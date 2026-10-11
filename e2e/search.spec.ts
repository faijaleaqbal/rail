import { test, expect } from "@playwright/test";

test.describe("F01: Search trains between stations", () => {
  test("happy path: search SBC→CBE, see results, click train, verify tracking", async ({ page }) => {
    await page.goto("/search");

    // Select From station
    const fromInput = page.getByRole("combobox", { name: /from station/i });
    await fromInput.fill("SBC");
    await page.getByRole("option", { name: /KSR Bengaluru/i }).click();

    // Select To station
    const toInput = page.getByRole("combobox", { name: /to station/i });
    await toInput.fill("CBE");
    await page.getByRole("option", { name: /Coimbatore/i }).click();

    // Click Find trains
    await page.getByRole("button", { name: "Find trains" }).click();

    // See results
    await expect(page.getByText(/train.*between stations/i)).toBeVisible();

    // Click first train card
    await page.getByRole("button", { name: /12658/i }).click();

    // Verify tracking page
    await expect(page).toHaveURL(/\/track\//);
    await expect(page.getByRole("heading", { name: /Chennai/i })).toBeVisible();
    await expect(page.getByRole("status").first()).toBeVisible();
  });

  test("empty From/To → error message", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("button", { name: "Find trains" }).click();
    await expect(page.getByText(/pick both stations/i)).toBeVisible();
  });

  test("invalid station 'xyz' → no suggestions", async ({ page }) => {
    await page.goto("/search");
    const fromInput = page.getByRole("combobox", { name: /from station/i });
    await fromInput.fill("xyz");
    await expect(page.getByText(/no station found/i)).toBeVisible();
  });

  test("partial 'ben' → shows Bengaluru Cantonment", async ({ page }) => {
    await page.goto("/search");
    const fromInput = page.getByRole("combobox", { name: /from station/i });
    await fromInput.fill("ben");
    await expect(page.getByRole("option", { name: /Bengaluru Cantonment/i })).toBeVisible();
  });

  test("double-click Find → no duplicate results", async ({ page }) => {
    await page.goto("/search");
    const fromInput = page.getByRole("combobox", { name: /from station/i });
    await fromInput.fill("SBC");
    await page.getByRole("option", { name: /KSR Bengaluru/i }).click();
    const toInput = page.getByRole("combobox", { name: /to station/i });
    await toInput.fill("CBE");
    await page.getByRole("option", { name: /Coimbatore/i }).click();

    const findBtn = page.getByRole("button", { name: "Find trains" });
    await findBtn.dblclick();

    // Should only show one results heading
    const headings = page.getByText(/train.*between stations/i);
    await expect(headings).toHaveCount(1);
  });
});
