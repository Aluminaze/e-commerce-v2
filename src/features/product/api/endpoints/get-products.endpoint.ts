import { Product } from '@/features/product/model';
import { ROUTE_API_PRIVATE } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

export interface ProductsResponseDto {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
}

export interface ProductsRequestDto {
	limit: number;
	skip: number;
}

export const qkGetProducts = (dto: ProductsRequestDto) => {
	return ['products', dto] as const;
};

export const getProducts = async ({
	limit,
	skip
}: ProductsRequestDto): Promise<ProductsResponseDto> => {
	const params = new URLSearchParams({
		limit: limit.toString(),
		skip: skip.toString()
	});
	const url = `${ROUTE_API_PRIVATE}/auth/products?${params}`;

	return await axiosAuth.get(url).then((resp) => resp.data);
};
