'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

import { useLogoutMutation } from '@/features/auth/api/auth.hooks';

import { useContextAuth } from '../store/context-auth';

export const Header: FC = () => {
	const { setUser } = useContextAuth();
	const logoutMutation = useLogoutMutation();
	const router = useRouter();

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onError: () => {
				toast.error('Logout failed');
			},
			onSuccess: () => {
				setUser(null);
				toast.success('Logged out');
				router.push('/login');
			}
		});
	};

	return (
		<header className='border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
			<div className='mx-auto flex max-w-4xl items-center justify-between px-4 py-3'>
				<h1 className='text-lg font-semibold'>Dashboard</h1>
				<button
					onClick={handleLogout}
					className='cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
					disabled={logoutMutation.isPending}
				>
					{logoutMutation.isPending ? 'Logout...' : 'Logout'}
				</button>
			</div>
		</header>
	);
};
