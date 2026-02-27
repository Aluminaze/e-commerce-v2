'use client';
import { FC, useEffect, useState } from 'react';

import { Product } from '../model';

interface ProductsListProps {
	initialProducts: Product[];
	initialTotal: number;
}

export const Products: FC<ProductsListProps> = ({
	initialProducts,
	initialTotal
}) => {
	const [items, setItems] = useState<Product[]>(initialProducts);

	useEffect(() => {
		setItems(initialProducts);
	}, [initialProducts]);

	return (
		<div>
			products
			<span>{items.length}</span>
		</div>
	);
};
