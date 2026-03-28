import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Shopping cart', () => {
  test('complete checkout flow', async ({ page, apiClient, productDetailPage }) => {
    // Get a product ID via API — more reliable than scraping the listing page
    const { data: products } = await apiClient.getProducts();
    await page.goto(`/product/${products[0].id}`, { waitUntil: 'domcontentloaded' });
    await expect(productDetailPage.productName).toBeVisible({ timeout: 15_000 });

    // Add to cart unauthenticated — guest carts are stored in localStorage, no API fires.
    // Wait for the cart badge to update before navigating away, otherwise Angular hasn't
    // finished writing to localStorage and the checkout page will see an empty cart.
    await productDetailPage.addToCartButton.click();
    // Wait for badge to explicitly show 1 — confirms Angular wrote the item to localStorage
    await expect(page.getByTestId('cart-quantity')).toHaveText('1', { timeout: 10_000 });

    // Proceed through the checkout wizard
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });

    // Step 1: Cart — proceed to sign in
    await page.getByTestId('proceed-1').click();

    // Step 2: Sign in
    await page.getByTestId('email').fill(users.customer.email);
    await page.getByTestId('password').fill(users.customer.password);
    await page.getByTestId('login-submit').click();
    // After login the wizard shows a proceed button rather than auto-advancing
    await page.getByTestId('proceed-2').click();

    // Step 3: Billing address — wait for wizard transition after login
    const addr = users.customer.address;
    await page.getByTestId('street').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('street').fill(addr.street);
    await page.getByTestId('city').fill(addr.city);
    await page.getByTestId('state').fill(addr.state);
    await page.getByTestId('country').fill(addr.country);
    await page.getByTestId('postal_code').fill(addr.postal_code);
    await page.getByTestId('proceed-3').click();

    // Step 4: Payment — select method and click finish to process
    await page.getByTestId('payment-method').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByTestId('payment-method').selectOption('cash-on-delivery');
    await page.getByTestId('finish').click();

    // The same finish button becomes "Confirm" after payment processing — click it again
    await expect(page.getByText('Payment was successful')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('finish').click();

    // Order confirmation message
    await expect(page.getByText(/Thanks for your order/)).toBeVisible({ timeout: 15_000 });
  });
});

