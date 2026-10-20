import { test, expect } from "@playwright/test";
import { mockFlights } from "../../fixtures/mock-flights";

test("на странице есть не пустой <h1>", async ({ page }) => {
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
    await page.getByTestId("flight-search-form").waitFor({ state: "visible" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Бронирование авиабилетов/);
});
