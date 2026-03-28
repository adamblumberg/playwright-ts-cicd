import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  test('complete checkout flow', async ({ page, apiClient }) => {
    // Navigate to a product and add to cart (unauthenticated)
    const { data: products } = await apiClient.getProducts();
    await page.goto(`/product/${products[0].id}`, { waitUntil: 'domcontentloaded' });
    await page.getByTestId('add-to-cart').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('add-to-cart').click();

    // Use the cart icon to navigate — SPA navigation keeps Angular's in-memory cart
    // state intact, avoiding the localStorage timing race that page.goto('/checkout') has
    await page.getByTestId('nav-cart').click();

    // Step 1: Cart
    await page.getByTestId('proceed-1').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('proceed-1').click();

    // Step 2: Sign in
    await page.getByTestId('email').fill(users.customer.email);
    await page.getByTestId('password').fill(users.customer.password);
    await page.getByTestId('login-submit').click();
    await page.getByTestId('proceed-2').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('proceed-2').click();

    // Step 3: Billing address
    const addr = users.customer.address;
    await page.getByTestId('state').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('street').fill(addr.street);
    await page.getByTestId('city').fill(addr.city);
    await page.getByTestId('state').fill(addr.state);
    await page.getByTestId('country').fill(addr.country);
    await page.getByTestId('postal_code').fill(addr.postal_code);
    await page.getByTestId('proceed-3').click();

    // Step 4: Payment
    await page.getByTestId('payment-method').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('payment-method').selectOption('cash-on-delivery');
    await page.getByTestId('finish').click();

    // Confirm payment then finalise order
    await expect(page.getByTestId('payment-success-message')).toContainText('Payment was successful', { timeout: 15_000 });
    // Wait for the Confirm button to be enabled before clicking
    await page.getByTestId('finish').waitFor({ state: 'visible', timeout: 10_000 });
    await expect(page.getByTestId('finish')).toBeEnabled({ timeout: 10_000 });
    await page.getByTestId('finish').click();

    await expect(page.getByText(/Thanks for your order/)).toBeVisible({ timeout: 30_000 });
  });
});

