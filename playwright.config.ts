import { defineConfig, devices } from '@playwright/test';

const APP_URL = "http://localhost:5173/";

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
        actionTimeout: process.env.CI ? 15_000 : 0,
        navigationTimeout: process.env.CI ? 45_000 : 0,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run build && npm run preview",
        url: APP_URL,
        reuseExistingServer: !!process.env.CI,
        timeout: 120 * 1000,
    },
    timeout: process.env.CI ? 60_000 : 30_000,
    expect: {
        timeout: process.env.CI ? 10_000 : 5_000,
    },
});
