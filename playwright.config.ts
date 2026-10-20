import { defineConfig, devices } from '@playwright/test';

const APP_URL = "http://127.0.0.1:8080";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: APP_URL,
        trace: "on-first-retry",
        actionTimeout: process.env.CI ? 45_000 : 0,
        navigationTimeout: process.env.CI ? 45_000 : 0,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npx frontend-flight-booking-server start -s ./dist",
        url: APP_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 360 * 1000,
        stdout: "pipe",
        stderr: "pipe",
    },
    timeout: process.env.CI ? 60_000 : 30_000,
    // expect: {
    //     timeout: process.env.CI ? 10_000 : 5_000,
    // },
});
