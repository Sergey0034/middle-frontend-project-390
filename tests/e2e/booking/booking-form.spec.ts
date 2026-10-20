import { test, expect } from "@playwright/test";
import { fillFormBooking } from "./helpers/fillFormBooking";

test.describe("Оформление бронирования", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/api/flights/fl_1", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
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
                }),
            });
        });
        await page.goto("/booking/fl_1");
        await expect(page.getByTestId("booking-form")).toBeVisible();
    });

    test("форма оформления брони", async ({ page }) => {
        await expect(page.getByTestId("booking-form")).toBeVisible();
    });

    test("выбранный рейс на странице оформления.", async ({ page }) => {
        await expect(page.getByTestId("booking-flight")).toBeVisible();
    });

    test("поля email, контакты и пассажиры", async ({ page }) => {
        await expect(page.getByTestId("contact-email")).toBeVisible();
        await expect(page.getByTestId("contact-phone")).toBeVisible();
        await expect(page.getByTestId("passenger-<0>-firstName")).toBeVisible();
        await expect(page.getByTestId("passenger-<0>-lastName")).toBeVisible();
        await expect(page.getByTestId("passenger-<0>-dob")).toBeVisible();
        await expect(page.getByTestId("passenger-<0>-document")).toBeVisible();
    });

    test("добавление пассажира", async ({ page }) => {
        const addPassengersBtn = page.getByTestId("add-passenger");
        await expect(addPassengersBtn).toBeVisible();
        await addPassengersBtn.click();
        await expect(page.getByTestId("passenger-<1>-firstName")).toBeVisible();
        await expect(page.getByTestId("passenger-<1>-lastName")).toBeVisible();
        await expect(page.getByTestId("passenger-<1>-dob")).toBeVisible();
        await expect(page.getByTestId("passenger-<1>-document")).toBeVisible();
    });

    test("бронирование", async ({ page }) => {
        await page.route("**/api/bookings", async (route) => {
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
        await fillFormBooking(page);
        await page.getByTestId("booking-submit").click();
        await expect(page.getByTestId("booking-success")).toBeVisible();

        const code = page.getByTestId("booking-code");
        await expect(code).toBeVisible();
        await expect(code).toHaveText(/^[A-Z0-9]{6}$/);
    });

    // На моках бэк отдает один и тот же результат id=fl_1
    // test("состояние «рейс не найден»: открыт /booking/<id рейса> с неизвестным id.", async ({ page }) => {
    //     await page.goto("/booking/test_1");
    //     await expect(page.getByTestId("flight-not-found")).toBeVisible();
    // });

    test("сообщение об ошибке оформления", async ({ page }) => {
        await page.route("**/api/bookings", async (route) => {
            await route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify({
                    statusCode: 400,
                    code: "validation_error",
                    message: "Укажите параметр date",
                }),
            });
        });
        const bookingBtn = page.getByTestId("booking-submit");
        await expect(bookingBtn).toBeVisible();
        await fillFormBooking(page);
        await bookingBtn.click();
        await expect(page.getByTestId("booking-error")).toBeVisible();
    });
});
