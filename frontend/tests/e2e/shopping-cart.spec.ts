import { expect, test } from '@playwright/test';

const products = [
  {
    productId: 41,
    name: 'SmartFeeder One',
    description: 'A smart feeder for testing the cart.',
    price: 100,
    imgName: 'feeder.png',
    sku: 'CART-TEST-001',
    unit: 'piece',
    supplierId: 1,
    discount: 0.25,
  },
];

test.describe('Shopping cart', () => {
  test('adds products, updates quantities, removes items, and persists across refresh', async ({
    page,
  }) => {
    await page.route('**/api/products', (route) =>
      route.fulfill({ json: products }),
    );
    await page.goto('/products');

    await page.getByRole('button', { name: 'Increase quantity of SmartFeeder One' }).click();
    await page.getByRole('button', { name: 'Increase quantity of SmartFeeder One' }).click();
    await page.getByRole('button', { name: 'Add 2 SmartFeeder One to cart' }).click();

    const cartLink = page.getByRole('link', { name: 'Shopping cart with 2 items' });
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
    await expect(page.getByText('$150.00').first()).toBeVisible();
    await expect(page.getByText('$152.50')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('link', { name: 'Shopping cart with 2 items' })).toBeVisible();
    const quantity = page.getByRole('spinbutton', { name: 'Quantity for SmartFeeder One' });
    await expect(quantity).toHaveValue('2');
    await quantity.fill('');
    await quantity.fill('3');
    await expect(page.getByText('$223.75')).toBeVisible();

    await page.getByRole('button', { name: 'Remove SmartFeeder One from cart' }).click();
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shopping cart with 0 items' })).toBeVisible();
  });
});
