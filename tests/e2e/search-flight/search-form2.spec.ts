import { test, expect } from "@playwright/test";
import { mockFlights } from "../../fixtures/mock-flights";

test.describe("Форма поиска рейсов", () => {

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

    test("Отображение всех полей формы", async ({page}) => {
         await page.goto("/", { waitUntil: "domcontentloaded" });
         await page.getByTestId("search-origin").selectOption({ label: "Москва" });
    });
});
