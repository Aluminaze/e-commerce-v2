'use client';
import Image from 'next/image';
import { FC, useEffect } from 'react';

import { useMeQuery } from '@/features/auth/api/auth.hooks';
import { useContextAuth } from '@/shared/store/context-auth';

export const UserInfo: FC = () => {
	const { setUser } = useContextAuth();
	const meQuery = useMeQuery();
	const user = meQuery.data;

	useEffect(() => {
		if (!meQuery.isLoading && user) {
			setUser(user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [meQuery.isLoading, user]);

	return (
		<div className='flex flex-col gap-3'>
			{meQuery.isLoading ? (
				<div className='w-full h-24 animate-pulse rounded-md bg-zinc-200/80' />
			) : (
				<div className='h-24 flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800'>
					{user ? (
						<div className='flex items-center gap-3'>
							{user.image && (
								<Image
									width={40}
									height={40}
									src={user.image}
									alt={user.username}
									className='rounded-full'
									loading='lazy'
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
					) : (
						<span>No user data</span>
					)}
				</div>
			)}
		</div>
	);
};
