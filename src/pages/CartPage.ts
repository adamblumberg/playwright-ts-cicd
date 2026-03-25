import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems               = page.locator('[data-testid="cart-item"]');
    this.cartTotal               = page.getByTestId('cart-total');
    this.proceedToCheckoutButton = page.getByTestId('proceed-1');
    this.emptyCartMessage        = page.getByTestId('cart-page-empty');
    this.deleteButtons           = page.locator('[data-testid="delete-product"]');
  }

  async goto(): Promise<void> {
    await super.goto('/checkout');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getTotal(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async removeItemAt(index: number): Promise<void> {
    await this.deleteButtons.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
