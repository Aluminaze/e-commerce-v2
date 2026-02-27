import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { cartApi } from './cart.api';
import { GetCartByUserPayload } from './endpoints/get-cart-by-user.endpoint';

export const useAddToCartMutation = () => {
	return useMutation({
		mutationFn: cartApi.addToCart
	});
};

export const useGetCartByUser = (
	payload: GetCartByUserPayload,
	options?: Omit<
		UseQueryOptions<Awaited<ReturnType<typeof cartApi.getCartByUser>>, unknown>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: cartApi.qkGetCartByUser(payload),
		queryFn: () => cartApi.getCartByUser(payload),
		...options
	});
};
