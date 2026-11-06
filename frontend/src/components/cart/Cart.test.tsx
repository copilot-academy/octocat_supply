// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import Cart from './Cart';
import type { Product } from '../../types/Product';

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

const product: Product = {
  productId: 1, name: 'Solar Panel', description: 'Panel', price: 89,
  imgName: 'panel.png', sku: 'PANEL', unit: 'each', supplierId: 1,
};

function CartHarness() {
  const { addItem, itemCount } = useCart();
  return (
    <>
      <button onClick={() => addItem(product, 1)}>Add panel</button>
      <output aria-label="Cart count">{itemCount}</output>
      <Cart />
    </>
  );
}

afterEach(cleanup);

describe('cart interactions', () => {
  it('merges additions, applies quantity edits, removes items and shows empty state', () => {
    render(
      <MemoryRouter>
        <CartProvider><CartHarness /></CartProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
    fireEvent.click(screen.getByText('Add panel'));
    fireEvent.click(screen.getByText('Add panel'));
    expect(screen.getByLabelText('Cart count').textContent).toBe('2');
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByTestId('Subtotal').textContent).toBe('$178.00');

    fireEvent.change(screen.getByLabelText('Quantity of Solar Panel'), { target: { value: '3' } });
    expect(screen.getByLabelText('Cart count').textContent).toBe('2');
    fireEvent.click(screen.getByText('Update Cart'));
    expect(screen.getByLabelText('Cart count').textContent).toBe('3');
    expect(screen.getByTestId('Grand Total').textContent).toBe('$263.65');
    expect(screen.getByTestId('Discount (5%)').textContent).toBe('-$13.35');

    fireEvent.change(screen.getByLabelText('Quantity of Solar Panel'), { target: { value: '1.5' } });
    fireEvent.submit(screen.getByText('Update Cart').closest('form')!);
    expect(screen.getByText('Enter a positive whole number for every quantity.')).toBeTruthy();
    expect(screen.getByLabelText('Cart count').textContent).toBe('3');

    fireEvent.click(screen.getByLabelText('Remove Solar Panel'));
    expect(screen.getByLabelText('Cart count').textContent).toBe('0');
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
    fireEvent.click(screen.getByText('Add panel'));
    expect((screen.getByLabelText('Quantity of Solar Panel') as HTMLInputElement).value).toBe('1');
  });
});
