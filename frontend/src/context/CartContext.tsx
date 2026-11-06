/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../types/Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantities: (quantities: Record<number, number>) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function validateQuantity(quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new Error('Cart quantity must be a positive whole number.');
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number) => {
    validateQuantity(quantity);
    setItems((current) => {
      const existing = current.find((item) => item.product.productId === product.productId);
      if (!existing) {
        return [...current, { product, quantity }];
      }
      validateQuantity(existing.quantity + quantity);
      return current.map((item) =>
        item.product.productId === product.productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });
  };

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((item) => item.product.productId !== productId));
  };

  const updateQuantities = (quantities: Record<number, number>) => {
    Object.values(quantities).forEach(validateQuantity);
    setItems((current) => current.map((item) => ({
      ...item,
      quantity: quantities[item.product.productId] ?? item.quantity,
    })));
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      removeItem,
      updateQuantities,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
