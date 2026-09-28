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

