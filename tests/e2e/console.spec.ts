import { test, expect } from "@playwright/test";

test("главная открывается без ошибок в консоли", async ({ page }) => {
    const errors: string[] = [];
     page.on("console", (msg) => {
         if (msg.type() === "error") {
             errors.push(`console.error: ${msg.text()}`);
         }
     });
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    expect(errors, `Ошибки в консоли:\n${errors.join("\n")}`).toEqual([]);
});
