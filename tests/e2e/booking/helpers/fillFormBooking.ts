import { type Page } from "@playwright/test";

export async function fillFormBooking(page: Page) {
    await page.getByTestId("contact-email").fill("test@test.com");
    await page.getByTestId("contact-phone").fill("+79999999999");
    await page.getByTestId("passenger-0-firstName").fill("Иван");
    await page.getByTestId("passenger-0-lastName").fill("Тестов");
    await page.getByTestId("passenger-0-dob").fill("2000-05-25");
    await page.getByTestId("passenger-0-document").fill("5555555555");
}
