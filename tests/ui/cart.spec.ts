import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  // Sign in before each test so we have an authenticated session
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWait(users.customer.email, users.customer.password);
    await productsPage.goto();
  });

  test('add a product to the cart', async ({ productsPage, productDetailPage, cartPage }) => {
    const names = await productsPage.getProductNames();
    await productsPage.openProductByName(names[0]);
    await productDetailPage.addToCart();

    await cartPage.goto();
    await expect(cartPage.cartItems.first()).toBeVisible();
  });

  test('remove a product from the cart', async ({ productsPage, productDetailPage, cartPage }) => {
    const names = await productsPage.getProductNames();
    await productsPage.openProductByName(names[0]);
    await productDetailPage.addToCart();

    await cartPage.goto();
    await cartPage.removeItemAt(0);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
