'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';

export const Header: FC = () => {
	const router = useRouter();
	const [isFetching, setIsFetching] = useState(false);

	const handleLogout = async () => {
		try {
			setIsFetching(true);

			const res = await fetch('/api/auth/logout', { method: 'POST' });

			if (!res.ok) {
				throw new Error();
			}

			toast.success('Logged out');
			router.push('/login');
		} catch {
			toast.error('Logout failed');
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<header className='border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
			<div className='mx-auto flex max-w-4xl items-center justify-between px-4 py-3'>
				<h1 className='text-lg font-semibold'>Dashboard</h1>
				<button
					onClick={handleLogout}
					className='cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
					disabled={isFetching}
				>
					{isFetching ? 'Logout...' : 'Logout'}
				</button>
			</div>
		</header>
	);
};
