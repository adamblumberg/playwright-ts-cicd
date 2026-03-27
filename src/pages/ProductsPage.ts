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
    await super.goto('/');
    // Wait for at least one product card — confirms the page has loaded data
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForResponse(
      (resp) => resp.url().includes('/products') && resp.status() === 200
    );
  }

  async selectCategory(category: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: category }).first().click();
    await this.page.waitForResponse(
      (resp) => resp.url().includes('/products') && resp.status() === 200
    );
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForResponse(
      (resp) => resp.url().includes('/products') && resp.status() === 200
    );
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
