import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/config';
import { Product, CartItem } from '../types/cart';

interface ApiCartItem {
	cartItemId: number;
	cartId: string;
	productId: number;
	quantity: number;
	unitPrice: number;
}

const CART_ID_STORAGE_KEY = 'octocat-supply-cart-id';

export function useCartApi() {
	const [cartId, setCartId] = useState<string | null>(null);
	const [items, setItems] = useState<CartItem[]>([]);
	const [isApiAvailable, setIsApiAvailable] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		initializeCart();
	}, []);

	const mapApiItemsToCartItems = (apiItems: ApiCartItem[]): CartItem[] => {
		return apiItems.map(item => ({
			orderDetailId: `${item.cartItemId}`,
			productId: item.productId,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
		}));
	};

	const initializeCart = async () => {
		const savedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);

		if (savedCartId) {
			try {
				const response = await axios.get(`${api.baseURL}${api.endpoints.cart}/${savedCartId}`);
				const cart = response.data;
				setCartId(cart.cartId);
				setItems(mapApiItemsToCartItems(cart.items || []));
				setIsApiAvailable(true);
				setIsInitialized(true);
				return;
			} catch (error) {
				console.warn('Failed to load cart from API, will try creating new cart', error);
			}
		}

		try {
			const response = await axios.post(`${api.baseURL}${api.endpoints.cart}`);
			const cart = response.data;
			setCartId(cart.cartId);
			localStorage.setItem(CART_ID_STORAGE_KEY, cart.cartId);
			setIsApiAvailable(true);
			setIsInitialized(true);
		} catch (error) {
			console.warn('Failed to create cart via API, API is unavailable', error);
			setIsApiAvailable(false);
			setIsInitialized(true);
		}
	};

	const addItem = async (product: Product, quantity: number): Promise<boolean> => {
		if (!isApiAvailable || !cartId) {
			return false;
		}

		try {
			await axios.post(`${api.baseURL}${api.endpoints.cart}/${cartId}/items`, {
				productId: product.productId,
				quantity,
				unitPrice: product.price,
			});

			const response = await axios.get(`${api.baseURL}${api.endpoints.cart}/${cartId}`);
			setItems(mapApiItemsToCartItems(response.data.items || []));
			return true;
		} catch (error) {
			console.error('Failed to add item via API', error);
			setIsApiAvailable(false);
			return false;
		}
	};

	const removeItem = async (orderDetailId: string): Promise<boolean> => {
		if (!isApiAvailable || !cartId) {
			return false;
		}

		try {
			const item = items.find(i => i.orderDetailId === orderDetailId);
			if (!item) {
				return false;
			}

			await axios.delete(`${api.baseURL}${api.endpoints.cart}/${cartId}/items/${item.productId}`);
			const response = await axios.get(`${api.baseURL}${api.endpoints.cart}/${cartId}`);
			setItems(mapApiItemsToCartItems(response.data.items || []));
			return true;
		} catch (error) {
			console.error('Failed to remove item via API', error);
			setIsApiAvailable(false);
			return false;
		}
	};

	const updateQuantity = async (orderDetailId: string, quantity: number): Promise<boolean> => {
		if (!isApiAvailable || !cartId) {
			return false;
		}

		try {
			const item = items.find(i => i.orderDetailId === orderDetailId);
			if (!item) {
				return false;
			}

			await axios.put(`${api.baseURL}${api.endpoints.cart}/${cartId}/items/${item.productId}`, {
				quantity,
			});
			const response = await axios.get(`${api.baseURL}${api.endpoints.cart}/${cartId}`);
			setItems(mapApiItemsToCartItems(response.data.items || []));
			return true;
		} catch (error) {
			console.error('Failed to update quantity via API', error);
			setIsApiAvailable(false);
			return false;
		}
	};

	const clearCart = async (): Promise<boolean> => {
		if (!isApiAvailable || !cartId) {
			return false;
		}

		try {
			await axios.delete(`${api.baseURL}${api.endpoints.cart}/${cartId}/clear`);
			setItems([]);
			return true;
		} catch (error) {
			console.error('Failed to clear cart via API', error);
			setIsApiAvailable(false);
			return false;
		}
	};

	return {
		items,
		isApiAvailable,
		isInitialized,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
	};
}
