// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import {env} from "./src/config/env";

// Load environment variables from .env file (default) or a custom env file
dotenv.config({ path: path.resolve(__dirname, process.env.ENV_FILE ?? '.env') });

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Fail the build on CI if test.only was accidentally left */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Limit parallel workers on CI */
  workers: process.env.CI ? 2 : undefined,

  /* Reporters */
  reporter: [
    ['html', { open: 'never' }],                         // HTML report always generated
    ['list'],                                             // Live console output during test run
  ],

  /* Global settings shared across all projects */
  use: {
    baseURL: env.uiBaseUrl,
    apiBaseUrl: env.apiBaseUrl,
    headless: process.env.HEADLESS !== 'false',          // controlled via .env

    /* Timeouts */
    actionTimeout: Number(process.env.TIMEOUT ?? 30_000),
    navigationTimeout: Number(process.env.TIMEOUT ?? 30_000),

    /* Always capture these on failure for easier debugging */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    /* Geolocation permission — useful for Google Maps */
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }, // e.g. San Francisco
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  },

  /* Global test timeout */
  timeout: Number(process.env.TIMEOUT ?? 30_000),
  expect: {
    timeout: 10_000, // assertion timeout
  },

  /* ─── PROJECTS ──────────────────────────────────────────────────── */
  projects: [

    // ── Desktop Browsers ──────────────────────────────────────────
    {
      name: 'ui-desktop',
      testDir: './tests/UI',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',  // uses your locally installed Google Chrome
      },
    },
     {
      name: 'ui-firefox-desktop',
      testDir: './tests/UI',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-safari-desktop',
      testDir: './tests/UI',
      use: { ...devices['Desktop Safari'] },
    },
    // ── API Tests (no browser needed) ─────────────────────────────
    {
      name: 'api',
      testDir: './tests/API',
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },
    {
      name: 'contract',
      testDir: './tests/contract',
/*      use: {
        baseURL: process.env.API_BASE_URL,
      },*/
    // TODO EXTEND the cross-browsing and device compatibility testing
    /*
        {
          name: 'ui-firefox-desktop',
          testDir: './tests/UI',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'ui-safari-desktop',
          testDir: './tests/UI',
          use: { ...devices['Desktop Safari'] },
        },

        // ── Mobile Viewports ──────────────────────────────────────────
        {
          name: 'ui-mobile-chrome',
          testDir: './tests/UI',
          use: { ...devices['Pixel 7'] },
        },
        {
          name: 'ui-mobile-safari',
          testDir: './tests/UI',
          use: { ...devices['iPhone 15'] },
        },

        // ── Tablet Viewports ──────────────────────────────────────────
        {
          name: 'ui-tablet-chrome',
          testDir: './tests/UI',
          use: { ...devices['iPad Pro 11'] },
        },
    */
    },
  ],
});
