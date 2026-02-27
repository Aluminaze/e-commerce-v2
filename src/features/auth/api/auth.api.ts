import { login } from './endpoints/login.endpoint';
import { logout } from './endpoints/logout.endpoint';
import { me, qkMe } from './endpoints/me.endpoint';

export const authApi = {
	login,
	logout,
	qkMe,
	me
} as const;
