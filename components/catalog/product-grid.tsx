/** @format */

import type { Product } from '@/lib/types/divulgador';

import ProductCard from './product-card';

type ProductGridProps = {
	products: Product[];
	totalCount?: number;
	onLoadMore?: () => void;
};

export default function ProductGrid({
	products,
	totalCount = products.length,
	onLoadMore,
}: ProductGridProps) {
	const hasMoreProducts = totalCount > products.length && onLoadMore;

	return (
		<section
			aria-label='Produtos visiveis'
			className='space-y-6'>
			<div className='flex flex-col gap-3 border-b border-border-soft pb-5 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted'>
						Vitrine aberta
					</p>
					<h2 className='mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem]'>
						Selecao aberta
					</h2>
				</div>
				<p className='text-sm leading-7 text-foreground-muted'>
					{products.length} de {totalCount} ofertas encontradas.
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8'>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
			</div>

			{hasMoreProducts ? (
				<div className='flex justify-center pt-4'>
					<button
						type='button'
						onClick={onLoadMore}
						className='inline-flex items-center rounded-full border border-brand-primary-strong bg-brand-primary-strong px-6 py-3 text-sm font-semibold text-surface shadow-(--shadow-soft) transition hover:bg-brand-primary hover:border-brand-primary'>
						Ver mais
					</button>
				</div>
			) : null}
		</section>
	);
}
