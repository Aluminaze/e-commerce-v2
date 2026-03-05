import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_COOKIE, DUMMYJSON_BASE_URL } from '@/shared/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
	const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

	const upstreamRes = await proxyFetch({
		req,
		upstreamUrl,
		accessToken,
		bodyBuf
	});

	return new NextResponse(upstreamRes.body, {
		status: upstreamRes.status,
		headers: stripHeadersForResponse(upstreamRes.headers)
	});
}

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
