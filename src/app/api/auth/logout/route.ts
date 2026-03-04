import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from '@/shared/config';
import { cookieBaseOptions } from '@/shared/lib/cookies';

function clearCookies(res: NextResponse) {
	res.cookies.set(ACCESS_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(REFRESH_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(SESSION_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
}

export async function POST() {
	const res = NextResponse.json({ ok: true });
	clearCookies(res);
	return res;
}

export async function GET(req: NextRequest) {
	const res = NextResponse.redirect(new URL('/login', req.url));
	clearCookies(res);
	return res;
}
