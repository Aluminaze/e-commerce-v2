import { User } from '@/features/user/model';
import { ROUTE_API_AUTH } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

export interface LogoutResponseDto {
	ok: string;
}

export async function logout(): Promise<LogoutResponseDto> {
	const url = `${ROUTE_API_AUTH}/logout`;

	return await axiosAuth.post(url).then((resp) => resp.data);
}
