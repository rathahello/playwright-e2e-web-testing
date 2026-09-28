========================================================================
PLAYWRIGHT E2E AUTOMATION TEST SUITE
========================================================================

Project Overview:
-----------------
This repository contains automated End-to-End (E2E) web tests built using 
Playwright and TypeScript, targeting SauceDemo (https://www.saucedemo.com/).

Directory Structure:
--------------------
playwright-e2e/
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD workflow
│
├── e2e/
│   └── login.spec.ts            # Test specifications (e.g., login flow)
│
├── fixtures/
│   └── credentials.json         # Test user credentials
│
├── supports/
│   └── pageObjects/
│       └── authentication.ts    # Page Object Model (POM) for login
│
├── playwright.config.ts         # Playwright test runner configuration
├── package.json                 # Project dependencies and npm scripts
├── package-lock.json            # Exact dependency tree lockfile
├── .gitignore                   # Git ignore rules for reports/artifacts
└── README.txt                   # Project documentation and user guide


========================================================================
PREREQUISITES
========================================================================
1. Node.js (version 18.x or higher / LTS recommended)
   Verify installation:
     node -v
     npm -v


========================================================================
SETUP & INSTALLATION
========================================================================
1. Install project dependencies:
     npm install

2. Install Playwright browser binaries (Chromium, Firefox, WebKit):
     npx playwright install

   Note: On Linux/CI environments, install system dependencies via:
     npx playwright install --with-deps


========================================================================
HOW TO RUN TESTS
========================================================================

1. Run all tests in headless mode across all browsers:
     npm test
   (or: npx playwright test)

2. Run tests with Playwright Interactive UI Mode (recommended for dev):
     npm run test:ui
   (or: npx playwright test --ui)

3. Run tests in headed mode (visible browser window):
     npm run test:headed
   (or: npx playwright test --headed)

4. Run tests on a specific browser project:
     npm run test:chromium     # Chromium / Google Chrome
     npm run test:firefox      # Mozilla Firefox
     npm run test:webkit       # WebKit / Apple Safari

5. Run a specific test file:
     npx playwright test e2e/login.spec.ts

6. Run a specific test by title match:
     npx playwright test -g "Access to Saucedemo System"

7. Run tests in Debug Mode (Playwright Inspector step-by-step):
     npm run test:debug
   (or: npx playwright test --debug)

8. View the HTML Test Report:
     npm run test:report
   (or: npx playwright show-report)


========================================================================
CONFIGURATION HIGHLIGHTS (playwright.config.ts)
========================================================================
- Test Directory: ./e2e
- Parallel Execution: Enabled (fullyParallel: true)
- Reporters: HTML report generated in playwright-report/
- Trace Recording: Captured automatically on first retry (trace: 'on-first-retry')
- Browsers: Chromium, Firefox, WebKit configured out of the box
- Slow Motion (slowMo): Set to 1000ms by default for visible step-by-step execution; can be adjusted via SLOWMO=<ms> env var (disabled on CI)


========================================================================
PAGE OBJECT MODEL (POM) USAGE
========================================================================
Page objects are organized under the supports/pageObjects/ folder.
Example usage in a test:

  import { test, expect } from '@playwright/test';
  import { AuthenticationPage } from '../supports/pageObjects/authentication';

  test('User login with Page Object', async ({ page }) => {
    const authPage = new AuthenticationPage();
    await authPage.accessUrl(page, 'https://www.saucedemo.com/');
    await authPage.loginFOrm(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });


========================================================================
CI/CD PIPELINE (GitHub Actions)
========================================================================
The workflow file (.github/workflows/playwright.yml) automatically triggers 
on push or pull requests to the 'main' and 'master' branches. It executes:
  1. npm ci
  2. npx playwright install --with-deps
  3. npx playwright test
  4. Uploads playwright-report as an artifact (retained for 30 days)
