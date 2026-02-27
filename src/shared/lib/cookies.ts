import { ENVINRONMENT } from '../constants/environments';

export function cookieBaseOptions() {
	return {
		httpOnly: true,
		secure: ENVINRONMENT.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/'
	};
}
