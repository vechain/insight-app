import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    timeout: 60_000,
    retries: 1,
    use: {
        baseURL: 'http://localhost:4173',
        headless: true,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'yarn preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
})
