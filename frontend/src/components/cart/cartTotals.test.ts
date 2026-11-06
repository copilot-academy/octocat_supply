import { describe, expect, it } from 'vitest';
import { cartTotals, unitPriceCents } from './cartTotals';
import type { Product } from '../../types/Product';

const product: Product = {
  productId: 1, name: 'Solar Panel', description: 'Panel', price: 89,
  imgName: 'panel.png', sku: 'PANEL', unit: 'each', supplierId: 1,
};

describe('cart totals', () => {
  it('matches the reference image totals', () => {
    expect(cartTotals([{ product, quantity: 3 }])).toEqual({
      subtotal: 26700, discount: 1335, shipping: 1000, grandTotal: 26365,
    });
  });

  it('does not charge shipping on an empty cart', () => {
    expect(cartTotals([])).toEqual({
      subtotal: 0, discount: 0, shipping: 0, grandTotal: 0,
    });
  });

  it('retains catalog discounts and rounds money to cents', () => {
    const discounted = { ...product, price: 19.99, discount: 0.15 };
    expect(unitPriceCents(discounted)).toBe(1699);
    expect(cartTotals([{ product: discounted, quantity: 2 }])).toEqual({
      subtotal: 3398, discount: 170, shipping: 1000, grandTotal: 4228,
    });
  });
});
