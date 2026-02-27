import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const hasAccess = request.cookies.has('accessToken');
	const hasRefresh = request.cookies.has('refreshToken');
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

	if (!hasAccess && !hasRefresh) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
