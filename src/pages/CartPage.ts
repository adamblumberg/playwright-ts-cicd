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
    this.cartItems               = page.locator('[data-test="product-title"]');
    this.cartTotal               = page.getByTestId('cart-total');
    this.proceedToCheckoutButton = page.getByTestId('proceed-1');
    this.emptyCartMessage        = page.locator('app-cart p');
    this.deleteButtons           = page.locator('a.btn-danger');
  }

  async goto(): Promise<void> {
    await super.goto('/checkout');
    await this.page.waitForLoadState('load');
  }

  async getItemCount(): Promise<number> {
    // Short wait in case cart is still loading; if empty, returns 0 immediately after timeout
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});
    return this.cartItems.count();
  }

  async getTotal(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async removeItemAt(index: number): Promise<void> {
    const countBefore = await this.cartItems.count();
    await this.deleteButtons.nth(index).click();
    // Wait for the DOM to reflect the removal
    await this.cartItems.nth(countBefore - 1).waitFor({ state: 'detached' });
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
