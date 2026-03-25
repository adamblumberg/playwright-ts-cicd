import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  // Sign in before each test so we have an authenticated session
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWait(users.customer.email, users.customer.password);
    await productsPage.goto();
    await productsPage.waitForLoad();
  });

  test('add a product to the cart', async ({
    productsPage,
    productDetailPage,
    cartPage,
    page,
  }) => {
    // Open first product
    const names = await productsPage.getProductNames();
    await productsPage.openProductByName(names[0]);

    // Add to cart and confirm toast
    await productDetailPage.addToCart();
    await expect(productDetailPage.toastMessage).toContainText(/added/i);

    // Navigate to cart and verify item count
    await cartPage.goto();
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('remove a product from the cart', async ({
    productsPage,
    productDetailPage,
    cartPage,
    page,
  }) => {
    // Add an item first
    const names = await productsPage.getProductNames();
    await productsPage.openProductByName(names[0]);
    await productDetailPage.addToCart();

    // Remove it
    await cartPage.goto();
    await cartPage.waitForLoad();
    const before = await cartPage.getItemCount();
    await cartPage.removeItemAt(0);
    const after = await cartPage.getItemCount();
    expect(after).toBe(before - 1);
  });

  test('empty cart shows empty state message', async ({ cartPage, page }) => {
    await cartPage.goto();
    await cartPage.waitForLoad();
    const count = await cartPage.getItemCount();
    if (count === 0) {
      await expect(cartPage.emptyCartMessage).toBeVisible();
    } else {
      // Remove all items
      for (let i = count - 1; i >= 0; i--) {
        await cartPage.removeItemAt(0);
      }
      await expect(cartPage.emptyCartMessage).toBeVisible();
    }
  });
});
