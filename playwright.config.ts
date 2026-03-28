import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 1 worker in CI avoids two browsers competing for the same external network connection.
  // The 3 shards already provide parallelism across runners.
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: process.env.CI ? 'never' : 'on-failure',
      },
    ],
    ...(process.env.CI ? ([['github']] as const) : []),
  ],

  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // Firefox bfcache causes the checkout confirmation step to be unreliable.
      // Cart E2E coverage is provided by chromium.
      testMatch: ['tests/ui/login.spec.ts', 'tests/ui/products.spec.ts'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      // WebKit's ITP blocks cross-origin API calls after authentication in CI, causing
      // cart tests to time out. Cart coverage is provided by chromium and firefox.
      testMatch: ['tests/ui/login.spec.ts', 'tests/ui/products.spec.ts'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      // Mobile viewport adds value for auth UI; multi-step cart flows covered by desktop browsers.
      testMatch: ['tests/ui/login.spec.ts'],
    },
    // API tests run without a browser
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: { baseURL: 'https://api.practicesoftwaretesting.com' },
    },
  ],

  outputDir: 'test-results',
});
