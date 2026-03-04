import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { LoginRequestDto } from '@/features/auth/api/endpoints/login.endpoint';
import {
	ACCESS_COOKIE,
	DUMMYJSON_BASE_URL,
	REFRESH_COOKIE,
	SESSION_COOKIE
} from '@/shared/config';
import { cookieBaseOptions } from '@/shared/lib/cookies';
import {
	getAccessTokenExpiresAtDate,
	getRefreshTokenExpiresAtDate
} from '@/shared/lib/jwt';

export async function POST(req: NextRequest) {
	const body = (await req.json().catch(() => null)) as LoginRequestDto | null;

	if (!body?.username || !body?.password) {
		return NextResponse.json(
			{ message: 'username/password required' },
			{ status: 400 }
		);
	}

	const upstreamRes = await fetch(`${DUMMYJSON_BASE_URL}/auth/login`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			username: body.username,
			password: body.password,
			expiresInMins: body.expiresInMins
		})
	});

	const data = await upstreamRes.json().catch(() => null);

	if (!upstreamRes.ok || !data?.accessToken || !data?.refreshToken) {
		const statusCode = upstreamRes.status;

		if (statusCode === HttpStatusCode.BadRequest) {
			return NextResponse.json(
				{
					message: upstreamRes.statusText,
					upstreamStatus: statusCode,
					data
				},
				{ status: statusCode }
			);
		}

		return NextResponse.json(
			{
				message: 'Login failed',
				upstreamStatus: upstreamRes.status,
				data
			},
			{ status: HttpStatusCode.Unauthorized }
		);
	}

	const sessionId = crypto.randomUUID();
	const accessExpiresAt = getAccessTokenExpiresAtDate();
	const refreshExpiresAt = getRefreshTokenExpiresAtDate();

	const res = NextResponse.json({
		user: {
			id: data.id,
			username: data.username,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			image: data.image
		},
		expiresAt: {
			access: accessExpiresAt.toISOString(),
			refresh: refreshExpiresAt.toISOString()
		}
	});

	res.cookies.set(ACCESS_COOKIE, data.accessToken, {
		...cookieBaseOptions(),
		expires: accessExpiresAt
	});

	res.cookies.set(REFRESH_COOKIE, data.refreshToken, {
		...cookieBaseOptions(),
		expires: refreshExpiresAt
	});

	res.cookies.set(SESSION_COOKIE, sessionId, {
		...cookieBaseOptions(),
		expires: refreshExpiresAt
	});

	return res;
}
