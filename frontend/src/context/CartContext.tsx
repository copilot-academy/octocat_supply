import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

const CART_STORAGE_KEY = 'octocat.cart.v1';
const DEFAULT_DISCOUNT_RATE = 0.05;
const DEFAULT_SHIPPING_FEE = 10;

export interface CartProduct {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  unit: string;
  discount?: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'SET_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' };

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  addItem: (product: CartProduct, quantity: number) => void;
  removeItem: (productId: number) => void;
  setItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (action.quantity <= 0) {
        return state;
      }

      const existingItem = state.items.find((item) => item.productId === action.product.productId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.product.productId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.productId),
      };
    }
    case 'SET_QUANTITY': {
      if (action.quantity < 1) {
        return state;
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.productId ? { ...item, quantity: action.quantity } : item,
        ),
      };
    }
    case 'CLEAR_CART': {
      return { items: [] };
    }
    default:
      return state;
  }
}

function readInitialState(): CartState {
  if (typeof window === 'undefined') {
    return { items: [] };
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] };
    }

    const sanitized = parsed.items.filter(
      (item) =>
        typeof item.productId === 'number' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.imgName === 'string' &&
        typeof item.unit === 'string' &&
        typeof item.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );

    return { items: sanitized };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readInitialState);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((acc, item) => {
      const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
      return acc + effectivePrice * item.quantity;
    }, 0);
    const discountAmount = subtotal * DEFAULT_DISCOUNT_RATE;
    const shippingFee = state.items.length > 0 ? DEFAULT_SHIPPING_FEE : 0;
    const total = subtotal - discountAmount + shippingFee;
    const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items: state.items,
      itemCount,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      addItem: (product: CartProduct, quantity: number) =>
        dispatch({ type: 'ADD_ITEM', product, quantity }),
      removeItem: (productId: number) => dispatch({ type: 'REMOVE_ITEM', productId }),
      setItemQuantity: (productId: number, quantity: number) =>
        dispatch({ type: 'SET_QUANTITY', productId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
