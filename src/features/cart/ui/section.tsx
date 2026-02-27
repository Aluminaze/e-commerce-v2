import { FC, PropsWithChildren } from 'react';

interface SectionProps {
	title: string;
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({
	title,
	children
}) => {
	return (
		<section className='rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
			<h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500'>
				{title}
			</h2>
			{children}
		</section>
	);
};
