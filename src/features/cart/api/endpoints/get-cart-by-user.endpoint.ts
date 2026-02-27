import { Cart } from '@/features/cart/model';
import { User } from '@/features/user/model';
import { ROUTE_API_PRIVATE } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

export interface CartsResponseDto {
	carts: Cart[];
	total: number;
	skip: number;
	limit: number;
}

export interface GetCartByUserPayload {
	userId: User['id'];
}

export const qkGetCartByUser = ({ userId }: GetCartByUserPayload) => {
	return ['carts', userId] as const;
};

export async function getCartByUser({
	userId
}: GetCartByUserPayload): Promise<CartsResponseDto> {
	const url = `${ROUTE_API_PRIVATE}/auth/carts/user/${userId}`;

	return await axiosAuth.get(url).then((resp) => resp.data);
}
