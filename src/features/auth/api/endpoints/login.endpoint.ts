import { User } from '@/features/user/model';
import { ROUTE_API_AUTH } from '@/shared/constants/route-api';
import { axiosAuth } from '@/shared/lib/axios';

export interface LoginResponseDto {
	user: User;
	expiresAt: { access: string; refresh: string };
}

export interface LoginRequestDto {
	username: string;
	password: string;
	expiresInMins: number;
}

export async function login(dto: LoginRequestDto): Promise<LoginResponseDto> {
	const url = `${ROUTE_API_AUTH}/login`;

	return await axiosAuth.post(url, dto).then((resp) => resp.data);
}
