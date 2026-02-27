import { addToCart } from './endpoints/add-to-cart.endpoint';
import {
	getCartByUser,
	qkGetCartByUser
} from './endpoints/get-cart-by-user.endpoint';

export const cartApi = {
	qkGetCartByUser,
	getCartByUser,
	addToCart
} as const;
