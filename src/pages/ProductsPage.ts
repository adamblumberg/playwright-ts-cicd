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
    this.productCards  = page.locator('[data-testid="product-name"]');
    this.sortDropdown  = page.getByTestId('sort');
    this.categoryLinks = page.locator('.nav-link.cat-link');
    this.pagination    = page.locator('ngb-pagination');
  }

  async goto(): Promise<void> {
    await super.goto('/');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCategory(category: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: category }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('networkidle');
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
