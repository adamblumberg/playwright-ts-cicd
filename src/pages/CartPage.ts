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
    // Start listening before navigation so we don't miss the response
    const cartApiResponse = this.page.waitForResponse(
      (resp) => resp.url().includes('/carts') && resp.status() === 200,
      { timeout: 5_000 }
    ).catch(() => { /* no cart session yet – that's OK */ });
    await super.goto('/checkout');
    await cartApiResponse;
    await this.page.waitForLoadState('networkidle');
  }

  async getItemCount(): Promise<number> {
    // Wait for the first item to appear (in case cart is still loading)
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});
    return this.cartItems.count();
  }

  async getTotal(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async removeItemAt(index: number): Promise<void> {
    await this.deleteButtons.nth(index).click();
    // Wait for the delete request + subsequent cart refetch from the API
    await this.page.waitForResponse(
      (resp) => resp.url().includes('/carts/') && resp.status() === 200,
      { timeout: 15_000 }
    );
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
