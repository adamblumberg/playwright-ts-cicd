import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWait(users.customer.email, users.customer.password);
  });

  test('add a product to the cart', async ({ page, apiClient, productDetailPage, cartPage }) => {
    // Fetch a product via API and navigate directly — avoids loading the full listing page
    const { data: products } = await apiClient.getProducts();
    await page.goto(`/product/${products[0].id}`, { waitUntil: 'domcontentloaded' });
    await expect(productDetailPage.productName).toBeVisible({ timeout: 15_000 });
    await productDetailPage.addToCart();

    await cartPage.goto();
    await expect(cartPage.cartItems.first()).toBeVisible();
  });

  test('remove a product from the cart', async ({ page, apiClient, productDetailPage, cartPage }) => {
    const { data: products } = await apiClient.getProducts();
    await page.goto(`/product/${products[0].id}`, { waitUntil: 'domcontentloaded' });
    await expect(productDetailPage.productName).toBeVisible({ timeout: 15_000 });
    await productDetailPage.addToCart();

    await cartPage.goto();
    await cartPage.removeItemAt(0);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
