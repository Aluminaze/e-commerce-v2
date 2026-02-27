'use client';

import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { Product } from '@/features/product/model';

import { useGetMoreProducts, useGetProducts } from '../api/product.hooks';

import { ProductCard } from './product-card';

export const ProductsList: FC = () => {
	const productsQuery = useGetProducts({ limit: 5, skip: 0 });
	const getMoreProductsMutation = useGetMoreProducts();
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState(0);
	const hasMore = products.length < total;

	const handleLoadMore = () => {
		getMoreProductsMutation.mutate(
			{
				skip: products.length,
				limit: 5
			},
			{
				onError: () => {
					toast.error('Error loading products');
				},
				onSuccess: (data) => {
					setProducts((prev) => [...prev, ...data.products]);
					setTotal(data.total);
				}
			}
		);
	};

	useEffect(() => {
		if (!productsQuery.isLoading) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setProducts(productsQuery.data?.products || []);
			setTotal(productsQuery?.data?.total ?? 0);
		}
	}, [
		productsQuery.data?.products,
		productsQuery.data?.total,
		productsQuery.isLoading
	]);

	return (
		<>
			<ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{products.map((product) => (
					<li key={product.id}>
						<ProductCard data={product}></ProductCard>
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
		</>
	);
};
