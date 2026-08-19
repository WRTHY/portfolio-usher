import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Scoped to its own subfolder since e2e/ will end up holding sibling
  // implementations of the same test scenarios in other frameworks/languages
  // (Cypress, then Python, Java) alongside this one.
  testDir: './e2e/playwright',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Firefox/WebKit are left out for now: Firefox's binary won't spawn in
  // this sandboxed dev environment, and WebKit has a genuine pre-existing
  // focus-restoration bug in Modal.tsx (its useEffect cleanup calls
  // .focus() too late for WebKit to honor it) that's a separate fix.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
