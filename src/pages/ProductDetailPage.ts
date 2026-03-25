import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly productDescription: Locator;
  readonly categoryBreadcrumb: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productName        = page.getByTestId('product-name');
    this.productPrice       = page.getByTestId('unit-price');
    this.addToCartButton    = page.getByTestId('add-to-cart');
    this.quantityInput      = page.getByTestId('quantity');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.categoryBreadcrumb = page.locator('.breadcrumb-item').last();
    this.toastMessage       = page.locator('.toast-body');
  }

  async addToCart(quantity = 1): Promise<void> {
    if (quantity > 1) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
    // wait for the toast confirmation
    await this.toastMessage.waitFor({ state: 'visible', timeout: 8_000 });
  }

  async getPrice(): Promise<string> {
    return this.productPrice.innerText();
  }
}
