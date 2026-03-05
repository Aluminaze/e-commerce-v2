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

type RefreshResult = {
	accessToken: string;
	refreshToken: string;
	accessExpiresAt: Date;
	refreshExpiresAt: Date;
};

/* ---------- single-refresh map (per session) ---------- */

const g = globalThis as unknown as {
	__refreshInFlight?: Map<string, Promise<RefreshResult>>;
};
const refreshInFlight: Map<
	string,
	Promise<RefreshResult>
> = g.__refreshInFlight ?? (g.__refreshInFlight = new Map());

/* ---------- helpers ---------- */

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

/* ---------- single refresh per session ---------- */

async function refreshForSession(
	sessionId: string,
	refreshToken: string
): Promise<RefreshResult> {
	const existing = refreshInFlight.get(sessionId);
	if (existing) return existing;

	const p = (async () => {
		try {
			const res = await fetch(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					refreshToken,
					expiresInMins: REFRESH_TOKEN_TTL_MINS
				}),
				cache: 'no-store'
			});

			const data = await res.json().catch(() => null);

			if (!res.ok || !data?.accessToken || !data?.refreshToken) {
				throw new Error(`Refresh failed: ${res.status}`);
			}

			const accessExpiresAt = new Date(
				Date.now() + ACCESS_TOKEN_TTL_MINS * 60_000
			);
			const refreshExpiresAt = new Date(
				Date.now() + REFRESH_TOKEN_TTL_MINS * 60_000
			);

			return {
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				accessExpiresAt,
				refreshExpiresAt
			};
		} finally {
			refreshInFlight.delete(sessionId);
		}
	})();

	refreshInFlight.set(sessionId, p);
	return p;
}

/* ---------- apply refreshed tokens to request + response ---------- */

function applyTokens(
	request: NextRequest,
	response: NextResponse,
	tokens: RefreshResult,
	sessionId: string
) {
	request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
	request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);

	response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
		...cookieBaseOptions(),
		expires: tokens.accessExpiresAt
	});
	response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
		...cookieBaseOptions(),
		expires: tokens.refreshExpiresAt
	});
	response.cookies.set(SESSION_COOKIE, sessionId, {
		...cookieBaseOptions(),
		expires: tokens.refreshExpiresAt
	});
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

	if (pathname.startsWith('/api/private/')) {
		if (!hasRefresh || !sessionIdToken) {
			return NextResponse.next();
		}

		if (!hasAccess || isTokenExpired(accessToken!)) {
			try {
				const tokens = await refreshForSession(sessionIdToken, refreshToken!);

				request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
				request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);

				const response = NextResponse.next({
					request: { headers: request.headers }
				});

				applyTokens(request, response, tokens, sessionIdToken);
				return response;
			} catch {
				const res = NextResponse.json(
					{ message: 'Unauthorized' },
					{ status: 401 }
				);
				clearCookies(res);
				return res;
			}
		}

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
			const tokens = await refreshForSession(sessionIdToken, refreshToken!);

			const response = NextResponse.next({
				request: { headers: request.headers }
			});

			applyTokens(request, response, tokens, sessionIdToken);
			return response;
		} catch {
			const res = NextResponse.redirect(new URL('/login', request.url));
			clearCookies(res);
			return res;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
