import { test, expect } from "@playwright/test";
import { mockFlights } from "../../fixtures/mock-flights";

test.describe("Мои брони", () => {
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
        await page.getByTestId("nav-lookup").click();
    });

    test("форма поиска брони", async ({ page }) => {
        await expect(page.getByTestId("booking-lookup-form")).toBeVisible();
    });

    test("поиск существующей брони", async ({ page }) => {
        await page.route("**/api/bookings/AB1234**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    code: "AB1234",
                    status: "confirmed",
                    flight: {
                        id: "fl_1",
                        flightNumber: "SU1234",
                        airline: {
                            code: "SU",
                            name: "Аэрофлот",
                        },
                        origin: {
                            code: "MOW",
                            name: "Москва",
                            country: "Россия",
                        },
                        destination: {
                            code: "LED",
                            name: "Санкт-Петербург",
                            country: "Россия",
                        },
                        departureAt: "2026-07-01T08:00:00Z",
                        arrivalAt: "2026-07-01T09:25:00Z",
                        durationMinutes: 85,
                        price: {
                            amount: 5400,
                            currency: "RUB",
                        },
                        seatsAvailable: 42,
                    },
                    passengers: [
                        {
                            firstName: "Иван",
                            lastName: "Петров",
                            dateOfBirth: "1990-05-20",
                            documentNumber: "4509 123456",
                        },
                    ],
                    contact: {
                        email: "ivan@example.com",
                        phone: "+79991234567",
                    },
                    totalPrice: {
                        amount: 5400,
                        currency: "RUB",
                    },
                    createdAt: "2026-06-25T12:00:00Z",
                }),
            });
        });

        await expect(page.getByTestId("booking-not-found")).toBeVisible();
        await page.getByTestId("lookup-code").fill("AB1234");
        await page.getByTestId("lookup-lastName").fill("Иванов");
        await page.getByTestId("lookup-submit").click();

        await expect(page.getByTestId("booking-details")).toBeVisible();
        await expect(page.getByTestId("booking-code")).toHaveText(/AB1234/i);
        await expect(page.getByTestId("booking-status")).toHaveAttribute(
            "data-status",
            "confirmed",
        );

        await expect(page.getByTestId("cancel-booking")).toBeVisible();
    });
});
