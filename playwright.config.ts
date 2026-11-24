import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/playwright',
  fullyParallel: true,
  reporter: 'html',
  // Retries in CI only - locally a flaky test should just fail
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // TODO: add Firefox and WebKit
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
