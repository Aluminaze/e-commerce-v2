export interface CartProduct {
	id: number;
	title: string;
	quantity: number;
	price: number;
	total: number;
	discountedTotal: number;
	thumbnail: string;
}

export interface Cart {
	id: number;
	products: CartProduct[];
	total: number;
	discountedTotal: number;
	userId: number;
	totalProducts: number;
	totalQuantity: number;
}
