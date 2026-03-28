import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should log in with valid credentials', async ({ loginPage, page }) => {
    // loginAndWait uses a URL predicate rather than a hard-coded path, so it
    // stays green even if the site changes its post-login redirect.
    await loginPage.loginAndWait(users.customer.email, users.customer.password);
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(
      users.invalidCredentials.email,
      users.invalidCredentials.password,
    );
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should show validation error when fields are empty', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.emailError).toBeVisible();
  });

  test('login page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/login/i);
  });
});
