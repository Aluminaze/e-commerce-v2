import { cookies } from 'next/headers';
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------- types ---------- */

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

/* ---------- header helpers ---------- */

function stripHopByHopHeaders(headers: Headers) {
	const h = new Headers(headers);
	h.delete('connection');
	h.delete('keep-alive');
	h.delete('proxy-authenticate');
	h.delete('proxy-authorization');
	h.delete('te');
	h.delete('trailers');
	h.delete('transfer-encoding');
	h.delete('upgrade');
	h.delete('host');
	h.delete('content-length');
	return h;
}

function stripHeadersForResponse(headers: Headers) {
	const h = new Headers(headers);
	h.delete('set-cookie');
	h.delete('content-length');
	h.delete('content-encoding');
	return h;
}

/* ---------- proxy fetch ---------- */

async function proxyFetch(params: {
	req: NextRequest;
	upstreamUrl: string;
	accessToken?: string;
	bodyBuf?: ArrayBuffer;
}) {
	const { req, upstreamUrl, accessToken, bodyBuf } = params;

	const headers = stripHopByHopHeaders(req.headers);
	headers.delete('cookie');

	if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
	else headers.delete('authorization');

	const method = req.method.toUpperCase();
	const body = method === 'GET' || method === 'HEAD' ? undefined : bodyBuf;

	return fetch(upstreamUrl, {
		method,
		headers,
		body,
		cache: 'no-store'
	});
}

/* ---------- single refresh ---------- */

async function refreshForSession(
	sessionId: string,
	refreshToken: string
): Promise<RefreshResult> {
	const existing = refreshInFlight.get(sessionId);
	if (existing) return existing;

	const p = (async () => {
		try {
			const upstreamRes = await fetch(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					refreshToken,
					expiresInMins: REFRESH_TOKEN_TTL_MINS
				}),
				cache: 'no-store'
			});

			const data = await upstreamRes.json().catch(() => null);

			if (!upstreamRes.ok || !data?.accessToken || !data?.refreshToken) {
				throw new Error(`Refresh failed: ${upstreamRes.status}`);
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

/* ---------- clear cookies ---------- */

function clearAuthCookies(res: NextResponse) {
	res.cookies.set(ACCESS_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(REFRESH_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
	res.cookies.set(SESSION_COOKIE, '', { ...cookieBaseOptions(), maxAge: 0 });
}

/* ---------- main handler ---------- */

async function handle(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	const url = new URL(req.url);
	const { path: pathSegments } = await ctx.params;
	const path = (pathSegments ?? []).join('/');
	const upstreamUrl = `${DUMMYJSON_BASE_URL}/${path}${url.search}`;

	const method = req.method.toUpperCase();
	const bodyBuf =
		method === 'GET' || method === 'HEAD'
			? undefined
			: await req.clone().arrayBuffer();

	const cookieStore = await cookies();
	const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
	const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
	const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

	let upstreamRes = await proxyFetch({
		req,
		upstreamUrl,
		accessToken,
		bodyBuf
	});

	if (upstreamRes.status === 401) {
		if (!sessionId || !refreshToken) {
			const res = NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
			clearAuthCookies(res);
			return res;
		}

		try {
			const tokens = await refreshForSession(sessionId, refreshToken);

			upstreamRes = await proxyFetch({
				req,
				upstreamUrl,
				accessToken: tokens.accessToken,
				bodyBuf
			});

			const res = new NextResponse(upstreamRes.body, {
				status: upstreamRes.status,
				headers: stripHeadersForResponse(upstreamRes.headers)
			});

			res.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
				...cookieBaseOptions(),
				expires: tokens.accessExpiresAt
			});

			res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
				...cookieBaseOptions(),
				expires: tokens.refreshExpiresAt
			});

			res.cookies.set(SESSION_COOKIE, sessionId, {
				...cookieBaseOptions(),
				expires: tokens.refreshExpiresAt
			});

			return res;
		} catch {
			const res = NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
			clearAuthCookies(res);
			return res;
		}
	}

	return new NextResponse(upstreamRes.body, {
		status: upstreamRes.status,
		headers: stripHeadersForResponse(upstreamRes.headers)
	});
}

/* ---------- exports per method ---------- */

export function GET(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function POST(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function PUT(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function PATCH(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function DELETE(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function HEAD(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
export function OPTIONS(
	req: NextRequest,
	ctx: { params: Promise<{ path?: string[] }> }
) {
	return handle(req, ctx);
}
