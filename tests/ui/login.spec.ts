import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should log in with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(users.customer.email, users.customer.password);
    await expect(page).toHaveURL(/\/account/, { timeout: 10_000 });
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(
      users.invalidCredentials.email,
      users.invalidCredentials.password,
    );
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should show validation error when fields are empty', async ({
    loginPage,
  }) => {
    await loginPage.loginButton.click();
    // HTML5 validation or inline errors
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('login page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/login/i);
  });
});
