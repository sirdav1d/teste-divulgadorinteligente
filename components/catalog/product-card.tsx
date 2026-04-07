/** @format */
/* eslint-disable @next/next/no-img-element */

'use client';

import { getCategoryLabel } from '@/lib/storefront/category-filters';
import type { Product } from '@/lib/types/divulgador';

type ProductCardProps = {
	product: Product;
	onAddToCart?: (product: Product) => void;
};

const SELLER_LABELS: Record<string, string> = {
	amazon: 'Amazon',
	mercadolivre: 'Mercado Livre',
	magalu: 'Magazine Luiza',
	shopee: 'Shopee',
};

function getSellerLabel(seller: string) {
	return SELLER_LABELS[seller] ?? seller;
}

export default function ProductCard({
	product,
	onAddToCart,
}: ProductCardProps) {
	return (
		<article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-(--shadow-soft)'>
			<div className='flex h-full flex-col'>
				<div className='relative aspect-[4/4.6] overflow-hidden bg-white'>
					{product.imageUrl ? (
						<img
							alt={product.title}
							className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
							loading='lazy'
							src={product.imageUrl}
						/>
					) : (
						<div className='flex h-full items-center justify-center text-center'>
							<p className='text-sm text-foreground-muted'>
								Imagem indisponível
							</p>
						</div>
					)}
				</div>

				<div className='flex flex-1 flex-col px-5 py-5 sm:px-6'>
					<div className='flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-foreground-muted'>
						<span>{getSellerLabel(product.seller)}</span>
						<span>{getCategoryLabel(product.category)}</span>
					</div>

					<h2 className='mt-4 text-lg font-semibold tracking-wide text-foreground'>
						{product.title}
					</h2>

					<div className='mt-5 space-y-2'>
						{product.priceFromLabel ? (
							<p className='text-sm text-foreground-muted line-through'>
								{product.priceFromLabel}
							</p>
						) : null}
						<p className='text-2xl font-semibold tracking-[-0.04em] text-foreground'>
							{product.priceLabel ?? 'Consulte o preço'}
						</p>
						{product.installment ? (
							<p className='text-sm leading-7 text-foreground-muted'>
								{product.installment}
							</p>
						) : null}
					</div>

					<div className='mt-auto flex flex-col gap-3 pt-8'>
						{product.couponCode ? (
							<span className='text-sm text-foreground-muted'>
								{`Cupom ${product.couponCode}`}
							</span>
						) : null}
						<button
							type='button'
							onClick={() => onAddToCart?.(product)}
							className='inline-flex w-full items-center justify-center rounded-full border border-brand-primary-strong bg-brand-primary-strong px-4 py-3 text-sm font-semibold text-surface shadow-(--shadow-soft) transition hover:border-brand-primary hover:bg-brand-primary'>
							Adicionar ao carrinho
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
