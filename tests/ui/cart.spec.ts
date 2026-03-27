import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  // Sign in before each test so we have an authenticated session
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWait(users.customer.email, users.customer.password);
    await productsPage.goto();
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

    // Add to cart and confirm via cart count
    await productDetailPage.addToCart();

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
    const before = await cartPage.getItemCount();
    await cartPage.removeItemAt(0);
    await expect(cartPage.cartItems).toHaveCount(before - 1);
  });

  test('empty cart shows empty state message', async ({
    productsPage,
    productDetailPage,
    cartPage,
    page,
  }) => {
    // Add an item first so a cart session is created (live site requires this)
    const names = await productsPage.getProductNames();
    await productsPage.openProductByName(names[0]);
    await productDetailPage.addToCart();

    await cartPage.goto();
    const count = await cartPage.getItemCount();

    // Remove all items to reach the empty state
    for (let i = 0; i < count; i++) {
      await cartPage.removeItemAt(0);
    }

    await expect(cartPage.emptyCartMessage).toBeVisible({ timeout: 10_000 });
  });
});
