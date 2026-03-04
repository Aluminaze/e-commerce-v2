import { getMe } from '@/features/auth/api/server-fetch/get-me.server-fetch';
import { Product } from '@/features/product/model';
import { serverFetch } from '@/shared/lib/server-fetch';

import { ProductsListSSR } from './products-list-ssr';

const PRODUCTS_LIMIT = 10;

interface ProductsResponse {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
}

export async function ProductsViewerSSR() {
	const meResult = await getMe();

	if (meResult.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{meResult.message}</p>
			</div>
		);
	}

	const result = await serverFetch<ProductsResponse>(
		`auth/products?limit=${PRODUCTS_LIMIT}&skip=0`
	);

	if (result.status === 'error') {
		return (
			<div className='h-24 flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950'>
				<p className='text-red-600 dark:text-red-400'>{result.message}</p>
			</div>
		);
	}

	const { products, total } = result.data;

	if (products.length === 0) {
		return <p className='text-zinc-500 text-sm'>No products found.</p>;
	}

	return (
		<div className='w-full flex flex-col'>
			<h2 className='text-xl font-semibold mb-4'>Products</h2>
			<ProductsListSSR
				initialProducts={products}
				total={total}
				limit={PRODUCTS_LIMIT}
				userId={meResult.data.id}
			/>
		</div>
	);
}
