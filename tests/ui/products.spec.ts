import { test, expect } from '../../src/fixtures';

test.describe('Product browsing', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.waitForLoad();
  });

  test('homepage loads and displays products', async ({ productsPage }) => {
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('search returns relevant results', async ({
    productsPage,
    page,
  }) => {
    await productsPage.search('Pliers');
    const names = await productsPage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some((n) => /plier/i.test(n))).toBeTruthy();
  });

  test('search for non-existent product shows empty state', async ({
    productsPage,
    page,
  }) => {
    await productsPage.search('xyznonexistentproduct12345');
    await expect(productsPage.productCards).toHaveCount(0, { timeout: 10_000 });
  });

  test('can sort products by name (a-z)', async ({ productsPage }) => {
    await productsPage.sortBy('name,asc');
    const names = await productsPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('can filter by category', async ({ productsPage }) => {
    await productsPage.selectCategory('Hand Tools');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a product opens detail page', async ({
    productsPage,
    productDetailPage,
    page,
  }) => {
    const names = await productsPage.getProductNames();
    const first = names[0];
    await productsPage.openProductByName(first);
    await expect(page).toHaveURL(/\/product\//);
    await expect(productDetailPage.productName).toBeVisible();
  });
});
