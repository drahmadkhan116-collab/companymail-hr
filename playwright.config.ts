import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Fail the build on CI if a test.only was committed.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Reuses an already-running dev server locally; starts one on CI.
  // Waits on the PORT rather than a URL: a URL check follows the root 307 to
  // /dashboard, and until that route exists the 404 would read as "not ready".
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
