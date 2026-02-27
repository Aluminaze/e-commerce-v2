'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useId, useState } from 'react';
import { toast } from 'sonner';

import { REFRESH_TOKEN_TTL_MINS } from '@/shared/config';

import { useLoginMutation } from '../api/auth.hooks';
import { LoginRequestDto } from '../api/endpoints/login.endpoint';

export const LoginForm: FC = () => {
	const router = useRouter();
	const fieldUsername = useId();
	const fieldPassword = useId();
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const loginMutation = useLoginMutation();

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): void {
		e.preventDefault();

		const dto: LoginRequestDto = {
			username,
			password,
			expiresInMins: REFRESH_TOKEN_TTL_MINS
		};

		loginMutation.mutate(dto, {
			onError: (e) => {
				let message = 'Login error';

				if (e instanceof AxiosError) {
					const newMessage = e.response?.statusText ?? '';

					if (message) {
						message = newMessage;
					}
				}

				toast.error(message);
			},
			onSuccess: ({ user }) => {
				toast.success(`Welcome, ${user.firstName}!`);
				router.push('/dashboard');
			}
		});
	}

	return (
		<form onSubmit={handleSubmit} className='flex w-full flex-col gap-4'>
			<div className='flex flex-col gap-1.5'>
				<label
					htmlFor={fieldUsername}
					className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
				>
					Username
				</label>
				<input
					id={fieldUsername}
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className='rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'
					required
				/>
			</div>

			<div className='flex flex-col gap-1.5'>
				<label
					htmlFor={fieldPassword}
					className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
				>
					Password
				</label>
				<input
					id={fieldPassword}
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'
					required
				/>
			</div>

			<button
				type='submit'
				disabled={loginMutation.isPending}
				className='mt-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50'
			>
				{loginMutation.isPending ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	);
};
