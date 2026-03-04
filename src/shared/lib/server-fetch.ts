import { HttpStatusCode } from 'axios';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from '@/shared/config';

import { ROUTE_API_LOGOUT_PATHNAME } from '../constants/route-api';

export enum ServerFetchStatus {
	Ok = 'ok',
	Error = 'error'
}

export type ServerFetchResult<T> =
	| { status: ServerFetchStatus.Ok; data: T }
	| { status: ServerFetchStatus.Error; message: string };

const TOKEN_NAMES = [ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE] as const;

const getTokenStore = cache(
	() =>
		({
			[ACCESS_COOKIE]: null,
			[REFRESH_COOKIE]: null,
			[SESSION_COOKIE]: null
		}) as Record<string, string | null>
);

function captureTokens(res: Response) {
	const store = getTokenStore();
	const setCookies = res.headers.getSetCookie();

	for (const header of setCookies) {
		for (const name of TOKEN_NAMES) {
			if (header.startsWith(`${name}=`)) {
				const eqIdx = header.indexOf('=');
				const semiIdx = header.indexOf(';', eqIdx);
				const value =
					semiIdx === -1
						? header.slice(eqIdx + 1)
						: header.slice(eqIdx + 1, semiIdx);

				store[name] = value || null;
			}
		}
	}
}

export async function serverFetch<T>(
	path: string
): Promise<ServerFetchResult<T>> {
	try {
		const store = getTokenStore();
		const cookieStore = await cookies();
		const headerStore = await headers();

		const cookieHeader = TOKEN_NAMES.map((name) => {
			const val = store[name] ?? cookieStore.get(name)?.value;
			return val ? `${name}=${val}` : null;
		})
			.filter(Boolean)
			.join('; ');

		if (!cookieHeader) {
			redirect(ROUTE_API_LOGOUT_PATHNAME);
		}

		const host = headerStore.get('host') ?? 'localhost:3000';
		const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
		const baseUrl = `${protocol}://${host}`;

		const res = await fetch(`${baseUrl}/api/private/${path}`, {
			headers: { cookie: cookieHeader },
			cache: 'no-store'
		});

		captureTokens(res);

		if (res.status === HttpStatusCode.Unauthorized) {
			redirect(ROUTE_API_LOGOUT_PATHNAME);
		}

		if (!res.ok) {
			return {
				status: ServerFetchStatus.Error,
				message: `Request failed: ${res.status}`
			};
		}

		return { status: ServerFetchStatus.Ok, data: await res.json() };
	} catch (error) {
		if (error instanceof Error && 'digest' in error) {
			throw error;
		}

		let message = 'Unknown error';

		if (error instanceof Error) {
			message = error.message;
		}

		return { status: ServerFetchStatus.Error, message };
	}
}
