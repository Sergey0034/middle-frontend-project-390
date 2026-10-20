import { defineConfig, devices } from '@playwright/test';

const APP_URL = "http://127.0.0.1:4173";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: APP_URL,
        trace: "retain-on-failure",
        actionTimeout: process.env.CI ? 15_000 : 0,
        navigationTimeout: process.env.CI ? 20_000 : 0,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run build && npm run preview -- --host 127.0.0.1",
        url: APP_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 360 * 1000,
        stdout: "pipe",
        stderr: "pipe",
    },
    timeout: 30_000,
    expect: {
        timeout: process.env.CI ? 10_000 : 5_000,
    },
});
