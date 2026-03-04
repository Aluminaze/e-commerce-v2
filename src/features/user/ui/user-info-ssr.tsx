import Image from 'next/image';
import { cache } from 'react';

import { serverFetch } from '@/shared/lib/server-fetch';

import { User } from '../model';

export async function UserInfoSSR() {
	const result = await cache(() => serverFetch<User>('auth/me'))();

	if (result.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{result.message}</p>
			</div>
		);
	}

	const user = result.data;

	return (
		<div className='h-24 flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800'>
			<div className='flex items-center gap-3'>
				{user.image && (
					<Image
						width={40}
						height={40}
						src={user.image}
						alt={user.username}
						className='rounded-full'
					/>
				)}
				<div>
					<p className='font-medium'>
						{user.firstName} {user.lastName}
					</p>
					<p className='text-zinc-500'>{user.email}</p>
					<p className='text-xs text-zinc-400'>ID: {user.id}</p>
				</div>
			</div>
		</div>
	);
}
