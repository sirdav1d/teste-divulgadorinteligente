/** @format */

import type { Product } from '@/types/divulgador';

import { Skeleton } from '@/components/ui/skeleton';

import ProductCard from './product-card';

type ProductGridProps = {
	cartQuantities: Readonly<Record<string, number>>;
	hasMoreProducts?: boolean;
	isPending?: boolean;
	isLoadingMore?: boolean;
	onIncrement: (product: Product) => void;
	onDecrement: (productId: string) => void;
	products: readonly Product[];
	onLoadMore?: () => void;
};

type ProductCardSkeletonProps = {
	index: number;
};

function ProductCardSkeleton({ index }: ProductCardSkeletonProps) {
	return (
		<article
			aria-hidden='true'
			className='flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-(--shadow-soft)'>
			<Skeleton className='aspect-[4/4.6] rounded-none bg-surface-muted' />
			<div className='flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6'>
				<div className='flex items-center justify-between gap-3'>
					<Skeleton className='h-3 w-20 bg-surface-muted' />
					<Skeleton className='h-3 w-16 bg-surface-muted' />
				</div>
				<div className='space-y-3'>
					<Skeleton className='h-5 w-full bg-surface-muted' />
					<Skeleton className='h-5 w-4/5 bg-surface-muted' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-24 bg-surface-muted' />
					<Skeleton className='h-7 w-32 bg-surface-muted' />
				</div>
				<div className='mt-auto flex flex-col gap-3 pt-8'>
					{index % 2 === 0 ? (
						<Skeleton className='h-4 w-24 bg-surface-muted' />
					) : null}
					<Skeleton className='h-11 w-full rounded-full bg-surface-muted' />
				</div>
			</div>
		</article>
	);
}

export default function ProductGrid({
	cartQuantities,
	hasMoreProducts = false,
	isPending = false,
	isLoadingMore = false,
	onIncrement,
	onDecrement,
	products,
	onLoadMore,
}: ProductGridProps) {
	const skeletonCount = Math.max(Math.min(products.length || 12, 12), 4);
	const resultLabel = hasMoreProducts
		? `Mostrando ${products.length} ofertas.`
		: `${products.length} ofertas encontradas.`;

	return (
		<section
			aria-label='Produtos visíveis'
			className='space-y-6'>
			<div className='flex flex-col gap-3 border-b border-border-soft pb-5 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<h2 className='mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem]'>
						Suas ofertas
					</h2>
				</div>
				<p className='text-sm leading-7 text-foreground-muted'>
					{resultLabel}
				</p>
			</div>

			{isPending ? (
				<div className='grid gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8'>
					{Array.from({ length: skeletonCount }, (_, index) => (
						<ProductCardSkeleton
							key={`skeleton-${index + 1}`}
							index={index}
						/>
					))}
				</div>
			) : (
				<div className='grid gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8'>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							quantity={cartQuantities[product.id] ?? 0}
							onIncrement={onIncrement}
							onDecrement={onDecrement}
						/>
					))}
				</div>
			)}

			{hasMoreProducts && onLoadMore && !isPending ? (
				<div className='flex justify-center pt-4'>
					<button
						type='button'
						aria-busy={isLoadingMore}
						disabled={isLoadingMore}
						onClick={onLoadMore}
						className='inline-flex items-center rounded-full border border-brand-primary-strong bg-brand-primary-strong px-6 py-3 text-sm font-semibold text-surface shadow-(--shadow-soft) transition hover:border-brand-primary hover:bg-brand-primary disabled:cursor-wait disabled:opacity-70'>
						{isLoadingMore ? 'Carregando...' : 'Ver mais'}
					</button>
				</div>
			) : null}
		</section>
	);
}
