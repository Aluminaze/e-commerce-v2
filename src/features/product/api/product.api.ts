import { getProducts, qkGetProducts } from './endpoints/get-products.endpoint';

export const productApi = {
	qkGetProducts,
	getProducts
} as const;
