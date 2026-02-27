'use client';

import Image from 'next/image';
import { FC } from 'react';
import { toast } from 'sonner';

import { useAddToCartMutation } from '@/features/cart/api/cart.hooks';
import { useContextAuth } from '@/shared/store/context-auth';

import { Product } from '../model';

interface ProductCardProps {
	data: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ data }) => {
	const { user } = useContextAuth();
	const addToCartMutation = useAddToCartMutation();

	const handleAddToCart = (productId: number) => {
		const userId = user?.id;

		addToCartMutation.mutate(
			{
				userId: userId!,
				products: [{ id: productId, quantity: 1 }]
			},
			{
				onError: () => {
					toast.error('Network error');
				},
				onSuccess: () => {
					toast.success('Cart added successfully');
				}
			}
		);
	};

	return (
		<div className='rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col gap-3'>
			<Image
				width={160}
				height={160}
				src={data.thumbnail}
				alt={data.title}
				className='w-full rounded-lg object-cover'
				loading='lazy'
			/>
			<div className='flex-1'>
				<h3 className='font-medium text-zinc-900 line-clamp-1'>{data.title}</h3>
				<p className='text-sm text-zinc-500 line-clamp-2 mt-1'>
					{data.description}
				</p>
				<div className='mt-2 flex items-center justify-between'>
					<span className='font-semibold text-zinc-800'>${data.price}</span>
					<span className='text-xs text-zinc-400'>
						★ {data.rating.toFixed(1)}
					</span>
				</div>
			</div>

			<button
				onClick={() => handleAddToCart(data.id)}
				disabled={addToCartMutation.isPending}
				className='w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50'
			>
				{addToCartMutation.isPending ? 'Adding…' : 'Add to cart'}
			</button>
		</div>
	);
};
