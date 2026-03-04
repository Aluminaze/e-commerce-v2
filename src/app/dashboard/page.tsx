import { Metadata } from 'next';
import { Suspense } from 'react';

import { CartViewer } from '@/features/cart/ui/cart-viewer';
import { ProductsViewer } from '@/features/product/ui/products-viewer';
import { UserInfoSSR } from '@/features/user/ui/user-info-ssr';
import { Header } from '@/shared/ui/header';

export const metadata: Metadata = {
	title: 'Dashboard'
};

export default function Page() {
	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
			<Header />

			<main className='mx-auto max-w-4xl space-y-6 p-4'>
				<Suspense
					fallback={
						<div className='w-full h-24 animate-pulse rounded-md bg-zinc-200/80' />
					}
				>
					<UserInfoSSR />
				</Suspense>

				<CartViewer />

				<ProductsViewer />
			</main>
		</div>
	);
}
