import Image from 'next/image';

import { getMe } from '@/features/auth/api/server-fetch/get-me.server-fetch';
import { Cart } from '@/features/cart/model';
import { serverFetch } from '@/shared/lib/server-fetch';

interface CartsResponse {
	carts: Cart[];
	total: number;
	skip: number;
	limit: number;
}

export async function CartViewerSSR() {
	const meResult = await getMe();

	if (meResult.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{meResult.message}</p>
			</div>
		);
	}

	const cartsResult = await serverFetch<CartsResponse>(
		`auth/carts/user/${meResult.data.id}`
	);

	if (cartsResult.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{cartsResult.message}</p>
			</div>
		);
	}

	const carts = cartsResult.data.carts;

	if (carts.length === 0) {
		return <p className='h-24 text-zinc-500 text-sm'>No items found.</p>;
	}

	const totalCartItems = carts.reduce(
		(sum, cart) => sum + cart.totalQuantity,
		0
	);
	const totalCartValue = carts.reduce(
		(sum, cart) => sum + cart.discountedTotal,
		0
	);

	return (
		<div className='w-full flex flex-col'>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
				<div className='rounded-xl border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-sm text-zinc-500'>Total carts</p>
					<p className='mt-1 text-3xl font-bold text-zinc-900'>
						{carts.length}
					</p>
				</div>
				<div className='rounded-xl border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-sm text-zinc-500'>Total items</p>
					<p className='mt-1 text-3xl font-bold text-zinc-900'>
						{totalCartItems}
					</p>
				</div>
				<div className='rounded-xl border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-sm text-zinc-500'>Total value</p>
					<p className='mt-1 text-3xl font-bold text-zinc-900'>
						${totalCartValue.toFixed(2)}
					</p>
				</div>
			</div>

			{carts.map((cart) => (
				<div
					key={cart.id}
					className='mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm'
				>
					<p className='mb-3 text-sm font-medium text-zinc-500'>
						Cart #{cart.id} — {cart.totalQuantity} item(s) — Discounted: $
						{cart.discountedTotal.toFixed(2)}
					</p>
					<ul className='divide-y divide-zinc-100'>
						{cart.products.map((p) => (
							<li key={p.id} className='flex items-center gap-3 py-2 text-sm'>
								<Image
									width={40}
									height={40}
									src={p.thumbnail}
									alt={p.title}
									className='rounded-md object-cover'
									loading='lazy'
								/>
								<span className='flex-1 text-zinc-700'>{p.title}</span>
								<span className='text-zinc-500'>×{p.quantity}</span>
								<span className='font-medium text-zinc-900'>
									${p.total.toFixed(2)}
								</span>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
