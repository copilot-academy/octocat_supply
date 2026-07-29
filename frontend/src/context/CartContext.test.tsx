/* @vitest-environment jsdom */
import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { CartProvider, useCart } from './CartContext';

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext totals', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('applies $25 shipping when subtotal is below $100', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(
        { productId: 1, name: 'Test Product', price: 30, imgName: 'item.png', unit: 'pcs' },
        2,
      );
    });

    expect(result.current.subtotal).toBe(60);
    expect(result.current.shippingFee).toBe(25);
    expect(result.current.total).toBe(85);
  });

  it('applies free shipping when subtotal is $100 or more', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(
        { productId: 2, name: 'Premium Product', price: 100, imgName: 'item.png', unit: 'pcs' },
        1,
      );
    });

    expect(result.current.subtotal).toBe(100);
    expect(result.current.shippingFee).toBe(0);
    expect(result.current.total).toBe(100);
  });
});
