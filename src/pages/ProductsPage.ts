import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly sortDropdown: Locator;
  readonly categoryLinks: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput   = page.getByTestId('search-query');
    this.searchButton  = page.getByTestId('search-submit');
    this.productCards  = page.locator('[data-test="product-name"]');
    this.sortDropdown  = page.getByTestId('sort');
    this.categoryLinks = page.locator('.checkbox label');
    this.pagination    = page.locator('ngb-pagination');
  }

  async goto(): Promise<void> {
    // Pre-register the response listener before navigation so we never miss it.
    // Waiting for the API response is more reliable than waiting for a DOM element
    // because it fires as soon as data arrives, before Angular finishes rendering.
    const productsResponse = this.page.waitForResponse(
      (r) => r.url().includes('/products') && r.status() === 200,
      { timeout: 45_000 },
    );
    await super.goto('/');
    await productsResponse;
  }

  async search(query: string): Promise<void> {
    const response = this.page.waitForResponse(
      (r) => r.url().includes('/products') && r.status() === 200,
    );
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await response;
  }

  async selectCategory(category: string): Promise<void> {
    const response = this.page.waitForResponse(
      (r) => r.url().includes('/products') && r.status() === 200,
    );
    await this.categoryLinks.filter({ hasText: category }).first().click();
    await response;
  }

  async sortBy(option: string): Promise<void> {
    const response = this.page.waitForResponse(
      (r) => r.url().includes('/products') && r.status() === 200,
    );
    await this.sortDropdown.selectOption(option);
    await response;
  }

  async openProductByName(name: string): Promise<void> {
    await this.productCards.filter({ hasText: name }).first().click();
  }

  async getProductNames(): Promise<string[]> {
    return this.productCards.allInnerTexts();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
