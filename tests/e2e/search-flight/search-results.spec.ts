import { test, expect, Page } from "@playwright/test";
import { mockFlights } from "../../fixtures/mock-flights";

async function fillSearchForm(
    page: Page,
    {
        origin = "Москва",
        destination = "Санкт-Петербург",
    }: { origin?: string; destination?: string } = {},
) {
    await page
        .getByTestId("search-origin")
        .locator(".ant-form-item-control-input-content")
        .click();
    await page
        .getByTestId("search-origin")
        .locator(".ant-select-dropdown:visible")
        .getByText(origin, { exact: true })
        .click();

    await page
        .getByTestId("search-destination")
        .locator(".ant-form-item-control-input-content")
        .click();
    await page
        .getByTestId("search-destination")
        .locator(".ant-select-dropdown:visible")
        .getByText(destination, { exact: true })
        .click();

    await page.getByTestId("search-date").click();
    await page.locator(".ant-picker-dropdown").waitFor({ state: "visible" });
    await page
        .locator(".ant-picker-cell-in-view:not(.ant-picker-cell-disabled)")
        .first()
        .click();

    await page.getByTestId("search-submit").click();
}

test.describe("Результаты поиска рейсов", () => {
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
        await page.goto("/");
    });

    test("Список рейсов после успешного поиска", async ({ page }) => {
        await page.route("**/api/flights**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockFlights),
            }),
        );

        await fillSearchForm(page);

        await expect(page.getByTestId("flight-results")).toBeVisible();
        await expect(page.getByTestId("flight-result-item")).toHaveCount(
            mockFlights.length,
        );
    });

    test("Рейсов не найдено", async ({ page }) => {
        await page.route("**/api/flights**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([]),
            }),
        );

        await fillSearchForm(page);

        await expect(page.getByTestId("flights-empty")).toBeVisible();
        await expect(page.getByTestId("flight-result-item")).toHaveCount(0);
    });

    test("Ошибку при сбое API", async ({ page }) => {
        const status = 500;
        await page.route("**/api/flights**", (route) =>
            route.fulfill({
                status,
                contentType: "application/json",
                body: JSON.stringify({ message: "Internal Server Error" }),
            }),
        );

        await fillSearchForm(page);

        await expect(page.getByTestId("flights-error")).toBeVisible();
    });
});
