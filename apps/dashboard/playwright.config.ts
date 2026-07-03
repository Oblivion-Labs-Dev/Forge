import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5175',
    trace: 'on-first-retry',
    viewport: { width: 1024, height: 682 },
    deviceScaleFactor: 1,
    colorScheme: 'dark'
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 5175',
    url: 'http://127.0.0.1:5175/?static=1',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
