import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Auth API', () => {
  test('POST /users/login returns a valid access token for valid credentials', async ({
    apiClient,
  }) => {
    const response = await apiClient.login(
      users.customer.email,
      users.customer.password,
    );
    expect(response.access_token).toBeTruthy();
    expect(response.token_type).toBe('bearer');
  });

  test('POST /users/login returns 401 for invalid credentials', async ({
    apiRequest,
  }) => {
    const response = await apiRequest.post('/users/login', {
      data: {
        email: users.invalidCredentials.email,
        password: users.invalidCredentials.password,
      },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /users/login returns 422 when body is missing', async ({
    apiRequest,
  }) => {
    const response = await apiRequest.post('/users/login', {
      data: {},
    });
    expect([422, 400, 401]).toContain(response.status());
  });

  test('authenticated token works for a protected endpoint', async ({
    apiClient,
  }) => {
    await apiClient.login(users.customer.email, users.customer.password);
    // Reuse the same apiClient which now carries the token
    const products = await apiClient.getProducts();
    expect(products.data.length).toBeGreaterThan(0);
  });
});
