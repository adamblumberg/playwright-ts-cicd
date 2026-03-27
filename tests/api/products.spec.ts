import { test, expect } from '../../src/fixtures';
import type { Product } from '../../src/api/ApiClient';

test.describe('Products API', () => {
  test('GET /products returns paginated list', async ({ apiClient }) => {
    const response = await apiClient.getProducts();

    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);
    expect(response.current_page).toBe(1);
    expect(response.per_page).toBeGreaterThan(0);
  });

  test('GET /products page 2 returns a different set', async ({ apiClient }) => {
    const page1 = await apiClient.getProducts({ page: 1 });
    const page2 = await apiClient.getProducts({ page: 2 });

    const ids1 = page1.data.map((p: Product) => p.id);
    const ids2 = page2.data.map((p: Product) => p.id);

    expect(ids1).not.toEqual(ids2);
  });

  test('GET /products/:id returns the correct product', async ({ apiClient }) => {
    const list = await apiClient.getProducts();
    const first = list.data[0];

    const product = await apiClient.getProduct(first.id);

    expect(product.id).toBe(first.id);
    expect(product.name).toBe(first.name);
    expect(product.price).toBeGreaterThan(0);
  });

  test('GET /products/:id returns 404 for unknown id', async ({ apiRequest }) => {
    const response = await apiRequest.get('/products/nonexistent-id-00000');
    expect(response.status()).toBe(404);
  });

  test('GET /products/search returns matches', async ({ apiClient }) => {
    const result = await apiClient.searchProducts('Hammer');

    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((p: Product) => {
      expect(p.name.toLowerCase()).toContain('hammer');
    });
  });

  test('GET /categories returns a non-empty list', async ({ apiClient }) => {
    const categories = await apiClient.getCategories();

    expect(categories).toBeInstanceOf(Array);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('id');
    expect(categories[0]).toHaveProperty('name');
  });

  test('product schema contains required fields', async ({ apiClient }) => {
    const list = await apiClient.getProducts();
    const product = list.data[0];

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(typeof product.price).toBe('number');
  });
});
