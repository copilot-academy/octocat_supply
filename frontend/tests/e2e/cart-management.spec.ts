import { expect, Page, test } from '@playwright/test';

const products = [
  {
    productId: 1,
    name: 'SmartFeeder One',
    description: 'An AI-powered feeder for cats.',
    price: 12.5,
    imgName: 'smartfeeder.png',
    sku: 'FEEDER-001',
    unit: 'each',
    supplierId: 1,
  },
  {
    productId: 2,
    name: 'Smart Collar',
    description: 'A connected collar for cats.',
    price: 4.99,
    imgName: 'smart-collar.png',
    sku: 'COLLAR-001',
    unit: 'each',
    supplierId: 1,
  },
];

async function addProduct(page: Page, name: string, quantity: number, expectedCartTotal: number) {
  const productCard = page.getByRole('heading', { name, exact: true }).locator('xpath=../..');
  const increaseQuantity = productCard.getByRole('button', {
    name: `Increase quantity of ${name}`,
  });

  for (let index = 0; index < quantity; index += 1) {
    await increaseQuantity.click();
  }

  await productCard.getByRole('button', {
    name: `Add ${quantity} ${name} to cart`,
  }).click();

  await expect(page.getByRole('link', { name: `Cart with ${expectedCartTotal} items` }))
    .toBeVisible();
}

async function addProductsAndOpenCart(page: Page, entries: Array<[string, number]>) {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  let expectedCartTotal = 0;
  for (const [name, quantity] of entries) {
    expectedCartTotal += quantity;
    await addProduct(page, name, quantity, expectedCartTotal);
  }

  await page.getByRole('link', { name: /Cart with \d+ items/ }).click();
  await expect(page).toHaveURL(/\/cart$/);
}

async function cartRow(page: Page, productName: string) {
  return page.getByRole('heading', { name: productName, exact: true }).locator('xpath=../..');
}

test.describe('Shopping cart management', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/cart**', (route) => route.abort());
    await page.route('**/api/products', (route) => route.fulfill({ json: products }));
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible();
  });

  test('browse products from an empty cart', async ({ page }) => {
    await page.getByRole('link', { name: 'Browse Products' }).click();

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('review cart items and order totals', async ({ page }) => {
    await addProductsAndOpenCart(page, [
      ['SmartFeeder One', 2],
      ['Smart Collar', 1],
    ]);

    await expect(page.getByRole('heading', { name: 'Shopping Cart (2 items)' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart with 3 items' })).toBeVisible();
    await expect(await cartRow(page, 'SmartFeeder One')).toContainText('$12.50 each');
    await expect(await cartRow(page, 'SmartFeeder One')).toContainText('$25.00');
    await expect(await cartRow(page, 'Smart Collar')).toContainText('$4.99');

    const summary = page.getByRole('heading', { name: 'Order Summary' }).locator('..');
    await expect(summary.getByText('$29.99', { exact: true })).toHaveCount(2);
    await expect(summary.getByText('Free')).toBeVisible();
    await expect(summary.getByText('Calculated at checkout')).toBeVisible();
  });

  test('change a product quantity with the keyboard', async ({ page }) => {
    await addProductsAndOpenCart(page, [['SmartFeeder One', 1]]);

    const row = await cartRow(page, 'SmartFeeder One');
    const increase = row.getByRole('button', { name: '+' });
    await increase.focus();
    await page.keyboard.press('Enter');

    await expect(row.getByText('2', { exact: true })).toBeVisible();
    await expect(row).toContainText('$25.00');

    const summary = page.getByRole('heading', { name: 'Order Summary' }).locator('..');
    await expect(summary.getByText('$25.00', { exact: true })).toHaveCount(2);

    await row.getByRole('button', { name: '−' }).click();
    await expect(row.getByText('1', { exact: true })).toBeVisible();
    await expect(row.getByRole('button', { name: '−' })).toBeDisabled();
    await expect(summary.getByText('$12.50', { exact: true })).toHaveCount(2);
  });

  test('remove an individual product while retaining the remaining products', async ({ page }) => {
    await addProductsAndOpenCart(page, [
      ['SmartFeeder One', 2],
      ['Smart Collar', 1],
    ]);

    await (await cartRow(page, 'SmartFeeder One')).getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByRole('heading', { name: 'Shopping Cart (1 item)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SmartFeeder One' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Smart Collar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart with 1 items' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order Summary' }).locator('..')
      .getByText('$4.99', { exact: true })).toHaveCount(2);
  });

  test('clear the entire cart', async ({ page }) => {
    await addProductsAndOpenCart(page, [
      ['SmartFeeder One', 1],
      ['Smart Collar', 1],
    ]);

    await page.getByRole('button', { name: 'Clear entire cart' }).click();

    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart with 0 items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Products' })).toBeVisible();
  });

  test('continue shopping from a populated cart', async ({ page }) => {
    await addProductsAndOpenCart(page, [['SmartFeeder One', 1]]);

    await page.getByRole('link', { name: 'Continue Shopping' }).click();

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });
});
