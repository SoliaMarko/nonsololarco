import { defineConfig, devices } from '@playwright/test';

import { STORAGE_STATE } from './e2e/constants';

const WEB_URL = process.env.E2E_WEB_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  // A failing e2e is a real failure, not a flake to retry away. One retry in
  // CI absorbs genuine infrastructure noise; locally we want to see it fail.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['github'], ['html']] : [['list']],

  use: {
    baseURL: WEB_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Mints a JWT for the seeded user and saves it as a cookie, so the
    // specs start already signed in — OAuth can't be driven from a test.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],

  // Assumes `pnpm dev` is already running. Set E2E_START_SERVER=1 to have
  // Playwright boot the web app itself — CI does this against the production
  // build, since `next dev` compiles on first request and blows the timeout.
  // The API is always started separately; Playwright only waits on the web app.
  webServer: process.env.E2E_START_SERVER
    ? {
        command: process.env.E2E_WEB_COMMAND ?? 'pnpm --filter web dev',
        url: WEB_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
