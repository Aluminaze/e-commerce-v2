import { NextResponse } from 'next/server';

import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from '@/shared/config';
import { cookieBaseOptions } from '@/shared/lib/cookies';

export async function POST() {
	const res = NextResponse.json({ ok: true });
	res.cookies.set(ACCESS_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(REFRESH_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(SESSION_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	return res;
}
