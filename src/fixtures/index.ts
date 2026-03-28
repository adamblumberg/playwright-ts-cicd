import { test as base, type APIRequestContext } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ApiClient } from '@api/ApiClient';

/**
 * Custom fixture set that composes all page objects and the API client
 * so individual tests can destructure only what they need.
 */
type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  apiClient: ApiClient;
  apiRequest: APIRequestContext;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  apiRequest: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: 'https://api.practicesoftwaretesting.com',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    await use(context);
    await context.dispose();
  },

  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest));
  },
});

export { expect } from '@playwright/test';
