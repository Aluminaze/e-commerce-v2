import { NextRequest, NextResponse } from 'next/server';

import {
	ACCESS_COOKIE,
	ACCESS_TOKEN_TTL_MINS,
	DUMMYJSON_BASE_URL,
	REFRESH_COOKIE,
	REFRESH_TOKEN_TTL_MINS,
	SESSION_COOKIE
} from '@/shared/config';
import { cookieBaseOptions } from '@/shared/lib/cookies';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

function isTokenExpired(token: string): boolean {
	try {
		const [, payload] = token.split('.');
		const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
		return exp * 1000 < Date.now();
	} catch {
		return true;
	}
}

function clearCookies(res: NextResponse) {
	res.cookies.set(ACCESS_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(REFRESH_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(SESSION_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
	const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
	const sessionIdToken = request.cookies.get(SESSION_COOKIE)?.value;
	const hasAccess = !!accessToken;
	const hasRefresh = !!refreshToken;

	const isPublic =
		PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/favicon');

	if (pathname === '/login' && (hasAccess || hasRefresh)) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (isPublic) {
		return NextResponse.next();
	}

	if (pathname.startsWith('/api/')) {
		return NextResponse.next();
	}

	if ((!hasAccess && !hasRefresh) || !sessionIdToken) {
		const res = NextResponse.redirect(new URL('/login', request.url));
		clearCookies(res);
		return res;
	}

	if (hasRefresh && (!hasAccess || isTokenExpired(accessToken!))) {
		try {
			const refreshRes = await fetch(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					refreshToken,
					expiresInMins: REFRESH_TOKEN_TTL_MINS
				})
			});

			if (!refreshRes.ok) {
				const res = NextResponse.redirect(new URL('/login', request.url));
				clearCookies(res);
				return res;
			}

			const data = await refreshRes.json();

			const accessExpiresAt = new Date(
				Date.now() + ACCESS_TOKEN_TTL_MINS * 60_000
			);
			const refreshExpiresAt = new Date(
				Date.now() + REFRESH_TOKEN_TTL_MINS * 60_000
			);

			request.cookies.set(ACCESS_COOKIE, data.accessToken);
			request.cookies.set(REFRESH_COOKIE, data.refreshToken);

			const response = NextResponse.next({
				request: { headers: request.headers }
			});

			response.cookies.set(ACCESS_COOKIE, data.accessToken, {
				...cookieBaseOptions(),
				expires: accessExpiresAt
			});
			response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
				...cookieBaseOptions(),
				expires: refreshExpiresAt
			});
			response.cookies.set(SESSION_COOKIE, sessionIdToken ?? '', {
				...cookieBaseOptions(),
				expires: refreshExpiresAt
			});

			return response;
		} catch {
			return NextResponse.next();
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
