/** @format */

import Image from 'next/image';

import { getCategoryLabel } from '@/lib/storefront/category-filters';
import type { Product } from '@/lib/types/divulgador';

type ProductCardProps = {
	product: Product;
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

export default function ProductCard({ product }: ProductCardProps) {
	return (
		<article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-(--shadow-soft)'>
			<a
				className='flex h-full flex-col'
				href={product.link}
				target='_blank'
				rel='noopener noreferrer'>
				<div className='relative aspect-[4/4.6] overflow-hidden bg-white'>
					{product.imageUrl ? (
						<Image
							alt={product.title}
							className='object-cover transition-transform duration-500 group-hover:scale-[1.1]'
							fill
							sizes='(min-width: 1536px) 32rem, (min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw'
							src={product.imageUrl}
						/>
					) : (
						<div className='flex h-full items-center justify-center text-center'>
							<p className='text-sm text-foreground-muted'>
								Imagem indisponivel
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
							{product.priceLabel ?? 'Consulte o preco'}
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
						<span className='inline-flex w-full items-center justify-center rounded-full border border-brand-primary-strong bg-brand-primary-strong px-4 py-3 text-sm font-semibold text-surface shadow-(--shadow-soft)'>
							Ver oferta
						</span>
					</div>
				</div>
			</a>
		</article>
	);
}
