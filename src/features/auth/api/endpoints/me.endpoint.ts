import { User } from '@/features/user/model';
import { ROUTE_API_PRIVATE } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

export const qkMe = () => {
	return ['me'] as const;
};

export const me = async (): Promise<User> => {
	const url = `${ROUTE_API_PRIVATE}/auth/me`;

	return await axiosAuth.get(url).then((resp) => resp.data);
};
