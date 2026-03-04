'use client';

import { FC, useState } from 'react';
import { toast } from 'sonner';

import { Product } from '@/features/product/model';

import { useGetMoreProducts } from '../api/product.hooks';

import { ProductCard } from './product-card';

interface ProductsListSSRProps {
	initialProducts: Product[];
	total: number;
	limit: number;
	userId: number;
}

export const ProductsListSSR: FC<ProductsListSSRProps> = ({
	initialProducts,
	total,
	limit,
	userId
}) => {
	const [products, setProducts] = useState(initialProducts);
	const [totalProducts, setTotalProducts] = useState(total);
	const getMoreProductsMutation = useGetMoreProducts();
	const hasMore = products.length < total;

	const handleLoadMore = () => {
		getMoreProductsMutation.mutate(
			{
				skip: products.length,
				limit
			},
			{
				onError: () => {
					toast.error('Error loading products');
				},
				onSuccess: (data) => {
					setProducts((prev) => [...prev, ...data.products]);
					setTotalProducts(data.total);
				}
			}
		);
	};

	return (
		<div className='w-full flex flex-col'>
			<p className='mb-4 text-sm text-zinc-500'>
				Showing {products.length} of {totalProducts}
			</p>

			<ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{products.map((product) => (
					<li key={product.id}>
						<ProductCard data={product} userId={userId}></ProductCard>
					</li>
				))}
			</ul>

			{hasMore && (
				<div className='mt-6 flex justify-center'>
					<button
						onClick={handleLoadMore}
						disabled={getMoreProductsMutation.isPending}
						className='rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50'
					>
						{getMoreProductsMutation.isPending ? 'Loading…' : 'Load more'}
					</button>
				</div>
			)}
		</div>
	);
};
