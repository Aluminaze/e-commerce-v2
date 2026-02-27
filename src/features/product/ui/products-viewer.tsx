'use client';
import { FC } from 'react';

import { ProductsList } from '@/features/product/ui/products-list';

export const ProductsViewer: FC = () => {
	return (
		<div className='w-full flex flex-col'>
			<h2 className='text-xl font-semibold mb-4'>Products</h2>
			<ProductsList />
		</div>
	);
};
