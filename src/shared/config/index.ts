import { ENVINRONMENT } from '../constants/environments';

export const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const ACCESS_TOKEN_TTL_MINS = Number(
	ENVINRONMENT.ACCESS_TOKEN_TTL_MINS ?? 5
);

export const REFRESH_TOKEN_TTL_MINS = Number(
	ENVINRONMENT.REFRESH_TOKEN_TTL_MINS ?? 30
);

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';
export const SESSION_COOKIE = 'sessionId';
