import { Cart } from '@/features/cart/model';
import { Product } from '@/features/product/model';
import { User } from '@/features/user/model';
import { ROUTE_API_PRIVATE } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

type AddToCartRequestDto = {
	userId: User['id'];
	products: { id: Product['id']; quantity: number }[];
};

export const addToCart = async (dto: AddToCartRequestDto): Promise<Cart> => {
	const url = `${ROUTE_API_PRIVATE}/auth/carts/add`;

	return await axiosAuth.post(url, dto).then((resp) => resp.data);
};
