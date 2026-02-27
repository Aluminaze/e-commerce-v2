import { Metadata } from 'next';

import { LoginForm } from '@/features/auth/ui/login-form';

export const metadata: Metadata = {
	title: 'Sign in'
};

export default function LoginPage() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 px-4'>
			<div className='w-full max-w-sm flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-md'>
				<h1 className='mb-2 text-2xl font-bold text-zinc-900'>Sign in</h1>

				<LoginForm />
			</div>
		</div>
	);
}
