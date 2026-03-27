export interface Product {
	productId: number;
	name: string;
	price: number;
	description?: string;
	imgName?: string;
}

export interface CartItem {
	orderDetailId: string;
	productId: number;
	quantity: number;
	unitPrice: number;
	product?: Product;
}
