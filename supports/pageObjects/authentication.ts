import { Page, Locator } from '@playwright/test';

export class AuthenticationPage {
    async accessUrl(page: Page, url: string) {
        // Intercept third-party telemetry (Backtrace) that causes 401 (Unauthorized) errors
        await page.route('**/*backtrace.io/**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{}',
            });
        });
        await page.goto(url);
    }
    async loginFOrm(page: Page, username: string, password: string) {
        await page.fill('#user-name', username);
        await page.fill('#password', password);
        await page.click('#login-button');
    }
}

