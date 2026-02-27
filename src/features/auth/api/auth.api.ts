import { login } from './endpoints/login.endpoint';
import { me, qkMe } from './endpoints/me.endpoint';

export const authApi = {
	login,
	qkMe,
	me
} as const;
