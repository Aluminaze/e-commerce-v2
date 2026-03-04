import Image from 'next/image';

import { getMe } from '@/features/auth/api/server-fetch/get-me.server-fetch';

export async function UserInfoSSR() {
	const meResult = await getMe();

	if (meResult.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{meResult.message}</p>
			</div>
		);
	}

	const user = meResult.data;

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
