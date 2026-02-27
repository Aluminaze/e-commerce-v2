import { Metadata } from 'next';

import { CartViewer } from '@/features/cart/ui/cart-viewer';
import { Section } from '@/features/cart/ui/section';
import { ProductsViewer } from '@/features/product/ui/products-viewer';
import { UserInfo } from '@/features/user/ui/user-info';
import { Header } from '@/shared/ui/header';

export const metadata: Metadata = {
	title: 'Dashboard'
};

export default function Page() {
	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
			<Header />

			<main className='mx-auto max-w-4xl space-y-6 p-4'>
				<Section title='User Info'>
					<UserInfo />
				</Section>

				<CartViewer />

				<ProductsViewer />
			</main>
		</div>
	);
}
