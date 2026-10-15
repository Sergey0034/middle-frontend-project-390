import { test, expect } from "@playwright/test";

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
        await page.goto("/");
    });

    test("Отображение всех полей формы", async ({page}) => {
        await expect(page.getByTestId("flight-search-form")).toBeVisible();
        await expect(page.getByTestId("search-origin")).toBeVisible();
        await expect(page.getByTestId("search-destination")).toBeVisible();
        await expect(page.getByTestId("search-date")).toBeVisible();
        await expect(page.getByTestId("search-passengers")).toBeVisible();
        await expect(page.getByTestId("search-submit")).toBeVisible();
    });

    test("Ошибки валидации", async ({page}) => {
        await page.getByTestId("search-origin").hover();
        await page
            .getByTestId("search-origin")
            .locator(".ant-select-clear")
            .click();

        await page.getByTestId("search-destination").hover();
        await page
            .getByTestId("search-destination")
            .locator(".ant-select-clear")
            .click();

        await page.getByTestId("search-date").click();
        await page.locator(".ant-picker-clear").click();

        await page.getByTestId("search-passengers").clear();
        await expect(page.getByText("Укажите, откуда")).toBeVisible();
        await expect(page.getByText("Укажите, куда")).toBeVisible();
        await expect(page.getByText("Выберите дату")).toBeVisible();
        await expect(
            page.getByText("Укажите количество пассажиров"),
        ).toBeVisible();
    });

    test("Выбор города вылета", async ({page}) => {
        await page.getByTestId("search-origin")
            .locator(".ant-form-item-control-input-content")
            .click();
        await page
            .getByTestId("search-origin")
            .locator(".ant-select-dropdown:visible")
            .getByText("Москва", { exact: true })
            .click();

        await expect(page.getByTestId("search-origin")).toContainText("Москва");
    });

    test("Выбор города прилета", async ({page}) => {
        await page
            .getByTestId("search-destination")
            .locator(".ant-form-item-control-input-content")
            .click();
        await page
            .getByTestId("search-destination")
            .locator(".ant-select-dropdown:visible")
            .getByText("Санкт-Петербург", { exact: true })
            .click();

        await expect(page.getByTestId("search-destination")).toContainText(
            "Санкт-Петербург",
        );
    });

    test("Выбор даты", async ({page}) => {
        await page.getByTestId("search-date").click();
        await page
            .locator(".ant-picker-dropdown")
            .waitFor({ state: "visible" });
        await page
            .locator(".ant-picker-cell-in-view:not(.ant-picker-cell-disabled)")
            .first()
            .click();
        await expect(page.getByTestId("search-date")).not.toHaveValue("");
    });

    test("Число пассажиров", async ({page}) => {
        await page.getByTestId("search-passengers").fill(String(3));
        await expect(page.getByTestId("search-passengers")).toHaveValue("3");
    });
});
