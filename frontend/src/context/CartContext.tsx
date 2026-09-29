/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const CART_STORAGE_KEY = 'octocat-supply-cart';

export type CartProduct = {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (product: CartProduct, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === 'number' &&
    Number.isFinite(item.productId) &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.imgName === 'string' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.discount === undefined ||
      (typeof item.discount === 'number' && Number.isFinite(item.discount)))
  );
}

function readSavedCart(): CartItem[] {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!savedCart) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
      throw new Error('Saved cart has an invalid format.');
    }
    return parsed;
  } catch (error) {
    console.error('Unable to read the saved shopping cart.', error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readSavedCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: CartProduct, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.productId);
      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.productId
            ? { ...product, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentItems, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!Number.isInteger(quantity)) {
      return;
    }
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
