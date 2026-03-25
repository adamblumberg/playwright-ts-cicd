import { type Page, type Locator } from '@playwright/test';

/**
 * BasePage provides shared navigation helpers and common assertions
 * that all page objects inherit.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Hard-navigate to a path relative to baseURL */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait for the page to reach a network-idle state */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Return the current <title> text */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Return the visible text of any locator */
  async getText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  /** Click the nav-bar cart icon */
  async openCart(): Promise<void> {
    await this.page.getByTestId('nav-cart').click();
  }

  /** Click the nav-bar account icon, then Sign In */
  async openLogin(): Promise<void> {
    await this.page.getByTestId('nav-sign-in').click();
  }
}
