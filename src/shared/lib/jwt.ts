import { ACCESS_TOKEN_TTL_MINS, REFRESH_TOKEN_TTL_MINS } from '../config';

export function jwtExpToDate(token: string): Date | null {
	try {
		const payloadB64 = token.split('.')[1];
		if (!payloadB64) return null;
		const json = JSON.parse(
			Buffer.from(payloadB64, 'base64url').toString('utf8')
		);
		if (typeof json.exp === 'number') return new Date(json.exp * 1000);
		return null;
	} catch {
		return null;
	}
}

export const getAccessTokenExpiresAtDate = () =>
	new Date(Date.now() + ACCESS_TOKEN_TTL_MINS * 60_000);

export const getRefreshTokenExpiresAtDate = () =>
	new Date(Date.now() + REFRESH_TOKEN_TTL_MINS * 60_000);
