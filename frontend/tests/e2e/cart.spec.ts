import { test, expect } from '@playwright/test';

const products = [
  { productId: 1, name: 'Solar Panel', description: 'Solar panel', price: 89, imgName: 'copilot.png', sku: 'SP1', unit: 'each', supplierId: 1 },
  { productId: 2, name: 'Solar Panel2', description: 'Second panel', price: 89, imgName: 'copilot.png', sku: 'SP2', unit: 'each', supplierId: 1 },
  { productId: 3, name: 'Euronet Solar Panel', description: 'Third panel', price: 89, imgName: 'copilot.png', sku: 'SP3', unit: 'each', supplierId: 1 },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/products', (route) => route.fulfill({ json: products }));
});

test('adds, merges, updates and removes cart items across routes', async ({ page }) => {
  await page.goto('/products');
  for (const product of products) {
    await page.locator(`#increase-qty-${product.productId}`).click();
    await page.locator(`#add-to-cart-${product.productId}`).click();
  }
  await page.getByRole('link', { name: 'Shopping cart, 3 items' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByTestId('Subtotal')).toHaveText('$267.00');
  await expect(page.getByTestId('Discount (5%)')).toHaveText('-$13.35');
  await expect(page.getByTestId('Shipping')).toHaveText('$10.00');
  await expect(page.getByTestId('Grand Total')).toHaveText('$263.65');
  await expect(page.getByRole('button', { name: 'Checkout unavailable' })).toBeDisabled();

  await page.getByRole('link', { name: 'Products', exact: true }).click();
  await page.locator('#increase-qty-1').click();
  await page.locator('#add-to-cart-1').click();
  await page.getByRole('link', { name: 'Shopping cart, 4 items' }).click();
  await expect(page.getByRole('spinbutton', { name: 'Quantity of Solar Panel', exact: true })).toHaveValue('2');
  await expect(page.locator('tbody tr')).toHaveCount(3);

  const quantity = page.getByRole('spinbutton', { name: 'Quantity of Solar Panel', exact: true });
  await quantity.fill('0');
  await page.getByRole('button', { name: 'Update Cart' }).click();
  await expect(page.getByRole('link', { name: 'Shopping cart, 4 items' })).toBeVisible();
  await quantity.fill('3');
  await page.getByRole('button', { name: 'Update Cart' }).click();
  await expect(page.getByRole('link', { name: 'Shopping cart, 5 items' })).toBeVisible();
  await expect(page.getByTestId('Subtotal')).toHaveText('$445.00');
  await expect(page.getByTestId('Grand Total')).toHaveText('$432.75');

  for (const product of products) {
    await page.getByRole('button', { name: `Remove ${product.name}`, exact: true }).click();
  }
  await expect(page.getByText('Your cart is empty.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shopping cart, 0 items' })).toBeVisible();
  await page.getByRole('link', { name: 'Browse Products' }).click();
  await expect(page).toHaveURL(/\/products$/);
});

test('direct empty route and cart controls work at mobile width in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/cart');
  await expect(page.getByText('Your cart is empty.')).toBeVisible();
  await page.getByRole('link', { name: 'Browse Products' }).click();
  await page.locator('#increase-qty-1').click();
  await page.locator('#add-to-cart-1').click();
  await page.getByRole('link', { name: 'Shopping cart, 1 items' }).click();
  await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Update Cart' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shopping cart, 1 items' })).toBeInViewport();
  await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await expect(page.getByTestId('Grand Total')).toHaveText('$94.55');
  for (const width of [320, 375, 640, 768, 1024, 1517]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('link', { name: 'Shopping cart, 1 items' })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
