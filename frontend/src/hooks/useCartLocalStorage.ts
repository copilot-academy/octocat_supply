import { useState, useEffect } from 'react';
import { Product, CartItem } from '../types/cart';

const CART_STORAGE_KEY = 'octocat-supply-cart';

export function useCartLocalStorage() {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		loadFromStorage();
	}, []);

	useEffect(() => {
		saveToStorage();
	}, [items]);

	const loadFromStorage = () => {
		const savedCart = localStorage.getItem(CART_STORAGE_KEY);
		if (savedCart) {
			try {
				setItems(JSON.parse(savedCart));
			} catch (error) {
				console.error('Failed to load cart from localStorage:', error);
			}
		}
	};

	const saveToStorage = () => {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
	};

	const addItem = (product: Product, quantity: number) => {
		setItems(currentItems => {
			const existingItem = currentItems.find(item => item.productId === product.productId);

			if (existingItem) {
				return currentItems.map(item =>
					item.productId === product.productId
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				const newItem: CartItem = {
					orderDetailId: `temp-${product.productId}-${Date.now()}`,
					productId: product.productId,
					quantity,
					unitPrice: product.price,
					product
				};
				return [...currentItems, newItem];
			}
		});
	};

	const removeItem = (orderDetailId: string) => {
		setItems(currentItems => currentItems.filter(item => item.orderDetailId !== orderDetailId));
	};

	const updateQuantity = (orderDetailId: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(orderDetailId);
			return;
		}

		setItems(currentItems =>
			currentItems.map(item =>
				item.orderDetailId === orderDetailId
					? { ...item, quantity }
					: item
			)
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	return {
		items,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
	};
}
