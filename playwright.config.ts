import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Scoped to its own subfolder since e2e/ will end up holding sibling
  // implementations of the same test scenarios in other frameworks/languages
  // (Cypress, then Python, Java) alongside this one.
  testDir: './e2e/playwright',
  fullyParallel: true,
  reporter: 'html',
  // Retry only in CI, never locally - a spec that needs a retry to pass
  // locally should fail loudly, not get silently rerun. In CI this
  // absorbs the sandboxed-environment timing flakiness (see README/
  // cypress.config.ts for the Cypress side of the same issue) without
  // masking a genuinely broken spec, which would still fail all 3 tries.
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Firefox/WebKit are left out for now: Firefox's binary won't spawn in
  // this sandboxed dev environment. WebKit was held back by a focus bug in
  // the old case-study modal; the modal is gone, but WebKit hasn't been
  // re-verified against the suite since, so it isn't added back yet.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
