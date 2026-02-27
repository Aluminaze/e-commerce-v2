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

	// Authenticated user visiting /login → redirect to /dashboard
	if (pathname === '/login' && (hasAccess || hasRefresh)) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Public paths — allow through
	if (isPublic) {
		return NextResponse.next();
	}

	// API routes through gateway — let the route handler deal with auth
	if (pathname.startsWith('/api/')) {
		return NextResponse.next();
	}

	// No tokens at all → redirect to /login
	if (!hasAccess && !hasRefresh) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Has at least refreshToken → allow through (gateway will handle refresh)
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
