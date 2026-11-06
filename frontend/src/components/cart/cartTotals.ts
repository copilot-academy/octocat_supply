import type { CartItem } from '../../context/CartContext';
import type { Product } from '../../types/Product';

export const formatCurrency = (amount: number) =>
  `${amount < 0 ? '-' : ''}$${Math.abs(amount).toFixed(2)}`;

export function unitPriceCents(product: Product) {
  return Math.round(product.price * (1 - (product.discount ?? 0)) * 100);
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce(
    (total, item) => total + unitPriceCents(item.product) * item.quantity,
    0,
  );
  const discount = Math.round(subtotal * 0.05);
  const shipping = items.length > 0 ? 1000 : 0;
  return { subtotal, discount, shipping, grandTotal: subtotal - discount + shipping };
}
