'use client';

import Image from 'next/image';
import { FC } from 'react';

import { useContextAuth } from '@/shared/store/context-auth';

import { useGetCartByUser } from '../api/cart.hooks';

export const CartViewer: FC = () => {
	const { user } = useContextAuth();
	const userId = user?.id;
	const cartByUserQuery = useGetCartByUser(
		{ userId: userId! },
		{
			enabled: typeof userId === 'number'
		}
	);
	const carts = cartByUserQuery.data?.carts || [];

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
			<h2 className='mb-4 text-xl font-semibold text-zinc-900'>Your Cart</h2>

			{cartByUserQuery.isLoading ? (
				<p className='text-zinc-500 text-sm'>Loading data...</p>
			) : (
				<>
					{carts.length === 0 ? (
						<p className='text-zinc-500 text-sm'>No items found.</p>
					) : (
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
					)}
				</>
			)}

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
};
