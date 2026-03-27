import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput     = page.getByTestId('email');
    this.passwordInput  = page.getByTestId('password');
    this.loginButton    = page.getByTestId('login-submit');
    this.errorMessage   = page.getByTestId('login-error');
    this.welcomeMessage = page.getByTestId('page-title');
  }

  async goto(): Promise<void> {
    await super.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndWait(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // Wait for navigation away from the login page (redirect target can vary)
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15_000 });
  }
}
