import { useMutation, useQuery } from '@tanstack/react-query';

import { ProductsRequestDto } from './endpoints/get-products.endpoint';
import { productApi } from './product.api';

export const useGetProducts = (dto: ProductsRequestDto) => {
	return useQuery({
		queryKey: productApi.qkGetProducts(dto),
		queryFn: () => productApi.getProducts(dto)
	});
};

export const useGetMoreProducts = () => {
	return useMutation({
		mutationFn: productApi.getProducts
	});
};
