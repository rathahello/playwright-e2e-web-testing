# 🎭 Playwright E2E Web Testing

[![Playwright Tests](https://github.com/rathahello/playwright-e2e-web-testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/rathahello/playwright-e2e-web-testing/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-v1.40+-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A robust, enterprise-grade End-to-End (E2E) test automation framework built with [Playwright](https://playwright.dev/) and [TypeScript](https://www.typescriptlang.org/), implementing the **Page Object Model (POM)** design pattern. Tests validate user authentication, navigation, and critical flows on [SauceDemo](https://www.saucedemo.com/).

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Configuration Highlights](#-configuration-highlights)
- [Page Object Model (POM)](#-page-object-model-pom)
- [Test Data & Fixtures](#-test-data--fixtures)
- [CI/CD Pipeline](#-cicd-pipeline)
- [License](#-license)

---

## ✨ Features

- **Cross-Browser Support**: Pre-configured for Chromium (Google Chrome), Firefox, and WebKit (Apple Safari).
- **Page Object Model (POM)**: Modular, maintainable, and reusable architecture separating test logic from page selectors and interactions.
- **Slow Motion (`slowMo`)**: Built-in 1000ms delay between actions for clear visual step-by-step observation during local runs (auto-disabled on CI).
- **Network Interception**: Automatic routing to intercept and mock third-party telemetry (Backtrace) to suppress `401 (Unauthorized)` console noise.
- **Rich Reporting**: Comprehensive HTML reports with screenshots, DOM snapshots, and traces on failure.
- **CI/CD Integration**: Fully automated GitHub Actions workflow to run test suites on push and pull requests.

---

## 📁 Project Structure

```text
playwright-e2e/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions automated workflow
├── e2e/
│   └── login.spec.ts            # E2E test specifications (login flow)
├── fixtures/
│   └── domain.json              # Centralized environment URLs and test credentials
├── supports/
│   └── pageObjects/
│       └── authentication.ts    # Page Object for login page actions and locators
├── .gitignore                   # Ignore rules for node_modules, reports & traces
├── package.json                 # Scripts and dependency specifications
├── playwright.config.ts         # Global Playwright runner configuration
├── README.md                    # Project documentation
└── tsconfig.json                # TypeScript compilation and module resolution settings
```

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)**: Version `18.x` or higher (LTS recommended)
- **npm**: Version `9.x` or higher

Check your installed versions:
```bash
node -v
npm -v
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rathahello/playwright-e2e-web-testing.git
cd playwright-e2e-web-testing
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
Install required browser engines (Chromium, Firefox, WebKit):
```bash
npx playwright install
```

> **Note for Linux / CI Environments:** If running on Linux or headless servers, install system OS dependencies:
> ```bash
> npx playwright install --with-deps
> ```

---

## 🧪 Running Tests

The test suite provides several npm scripts tailored for different development and debugging scenarios:

| Command | Description |
| :--- | :--- |
| `npm test` | Runs all tests in headless mode across all configured browsers |
| `npm run test:headed` | Runs tests with visible browser windows (shows slow-motion steps) |
| `npm run test:ui` | Launches interactive Playwright UI Mode with time-travel debugging |
| `npm run test:chromium` | Runs tests exclusively on Chromium / Google Chrome |
| `npm run test:firefox` | Runs tests exclusively on Mozilla Firefox |
| `npm run test:webkit` | Runs tests exclusively on WebKit / Safari |
| `npm run test:debug` | Runs tests with the Playwright Step Inspector in debug mode |
| `npm run test:report` | Opens the latest HTML test report in your default browser |

### Customizing Slow-Motion (`slowMo`)
By default, tests run with a `1000ms` delay between actions for local visibility. You can customize the speed on the fly via the `SLOWMO` environment variable:

```powershell
# Windows PowerShell
$env:SLOWMO=500; npm run test:headed

# Linux / macOS / Bash
SLOWMO=500 npm run test:headed
```

---

## 🛠️ Configuration Highlights

Key settings defined in [`playwright.config.ts`](playwright.config.ts):

- **Parallel Execution**: Enabled across test files (`fullyParallel: true`).
- **Retries**: Automatically retries failed tests twice on CI (`retries: process.env.CI ? 2 : 0`).
- **Slow Motion**: `slowMo: 1000` locally, automatically disabled (`0`) on CI.
- **Trace Viewer**: Records traces on first retry (`trace: 'on-first-retry'`).
- **Reporting**: Generates an HTML report in `playwright-report/`.

---

## 🏛️ Page Object Model (POM)

This repository follows the Page Object Model design pattern to maintain clean and decoupled test code.

### Example Page Object (`supports/pageObjects/authentication.ts`):
```typescript
import { Page } from '@playwright/test';

export class AuthenticationPage {
  async accessUrl(page: Page, url: string) {
    // Intercept third-party telemetry that causes 401 errors
    await page.route('**/*backtrace.io/**', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto(url);
  }

  async loginFOrm(page: Page, username: string, password: string) {
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
  }
}
```

### Example Test Specification (`e2e/login.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';
import { AuthenticationPage } from '../supports/pageObjects/authentication';
import domain from '../fixtures/domain.json';

test('Access and Login to Saucedemo System successfully', async ({ page }) => {
  const authPage = new AuthenticationPage();

  await authPage.accessUrl(page, domain.url);
  await expect(page).toHaveTitle(/Swag Labs/);
  await authPage.loginFOrm(page, domain.username, domain.password);

  await expect(page).toHaveURL(domain.url + '/inventory.html');
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
```

---

## 🗄️ Test Data & Fixtures

Shared test data is stored in [`fixtures/domain.json`](fixtures/domain.json) and imported directly into tests:

```json
{
  "username": "standard_user",
  "password": "secret_sauce",
  "url": "https://www.saucedemo.com"
}
```

---

## 🔄 CI/CD Pipeline

Continuous Integration is powered by **GitHub Actions** via [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml):

1. Triggers on `push` and `pull_request` against primary branches.
2. Installs Node.js LTS, dependencies, and browser binaries.
3. Executes Playwright test suite in headless mode.
4. Uploads test execution reports as artifacts retained for 30 days.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
