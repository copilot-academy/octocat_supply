import { createContext, useContext, ReactNode } from 'react';
import { useCartApi } from '../hooks/useCartApi';
import { useCartLocalStorage } from '../hooks/useCartLocalStorage';
import { Product, CartItem } from '../types/cart';

interface CartContextType {
	items: CartItem[];
	totalItems: number;
	totalPrice: number;
	addItem: (product: Product, quantity?: number) => void;
	removeItem: (orderDetailId: string) => void;
	updateQuantity: (orderDetailId: string, quantity: number) => void;
	clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const apiCart = useCartApi();
	const localStorageCart = useCartLocalStorage();

	const items = apiCart.isApiAvailable ? apiCart.items : localStorageCart.items;

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

	const addItem = async (product: Product, quantity = 1) => {
		if (apiCart.isApiAvailable) {
			const success = await apiCart.addItem(product, quantity);
			if (!success) {
				localStorageCart.addItem(product, quantity);
			}
		} else {
			localStorageCart.addItem(product, quantity);
		}
	};

	const removeItem = async (orderDetailId: string) => {
		if (apiCart.isApiAvailable) {
			const success = await apiCart.removeItem(orderDetailId);
			if (!success) {
				localStorageCart.removeItem(orderDetailId);
			}
		} else {
			localStorageCart.removeItem(orderDetailId);
		}
	};

	const updateQuantity = async (orderDetailId: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(orderDetailId);
			return;
		}

		if (apiCart.isApiAvailable) {
			const success = await apiCart.updateQuantity(orderDetailId, quantity);
			if (!success) {
				localStorageCart.updateQuantity(orderDetailId, quantity);
			}
		} else {
			localStorageCart.updateQuantity(orderDetailId, quantity);
		}
	};

	const clearCart = async () => {
		if (apiCart.isApiAvailable) {
			const success = await apiCart.clearCart();
			if (!success) {
				localStorageCart.clearCart();
			}
		} else {
			localStorageCart.clearCart();
		}
	};

	return (
		<CartContext.Provider value={{
			items,
			totalItems,
			totalPrice,
			addItem,
			removeItem,
			updateQuantity,
			clearCart
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
