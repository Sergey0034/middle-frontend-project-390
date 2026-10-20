import { test, expect } from "@playwright/test";
import { mockFlights } from "../../fixtures/mock-flights";

test.describe("Открытие главной страницы без ошибок", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/api/cities", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([
                    { code: "MOW", name: "Москва" },
                    { code: "LED", name: "Санкт-Петербург" },
                    { code: "KZN", name: "Казань" },
                ]),
            }),
        );
        await page.route("**/api/flights**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockFlights),
            }),
        );

        await page.goto("/");
        await page
            .getByTestId("flight-search-form")
            .waitFor({ state: "visible" });
    });

    test("главная открывается без ошибок в консоли", async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") {
                errors.push(`console.error: ${msg.text()}`);
            }
        });

        await expect(page.locator("body")).toBeVisible();
        await expect(page.locator("h1")).toBeVisible();
        expect(errors, `Ошибки в консоли:\n${errors.join("\n")}`).toEqual([]);
    });
});
