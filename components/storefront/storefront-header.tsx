/** @format */

import Image from 'next/image';

import StorefrontHeroMedia from './storefront-hero-media';

type StorefrontHeaderProps = {
	selectedCoupon: string | null;
};

export default function StorefrontHeader({
	selectedCoupon,
}: StorefrontHeaderProps) {
	return (
		<header className='relative min-h-svhflow-hidden rounded-[2.75rem] bg-brand-primary text-text-on-hero shadow-(--shadow-float)'>
			<StorefrontHeroMedia
				posterSrc='/images/storefront-hero-poster.jpg'
				videoSrc='/videos/storefront-hero.mp4'
			/>

			<div className='relative flex min-h-svh flex-col justify-between px-6 py-6 sm:px-8 lg:px-12 lg:py-10'>
				<div className='flex items-center gap-4'>
					<div className='inline-flex items-center rounded-full border border-border-on-hero bg-surface-hero-chip-muted px-4 py-3 shadow-(--shadow-soft) backdrop-blur-xl'>
						<Image
							src='/brand/divulgador-inteligente-logo.svg'
							alt='Divulgador Inteligente'
							width={176}
							height={64}
							unoptimized
							priority
							className='h-7 w-auto sm:h-8'
						/>
					</div>
				</div>

				<div className='max-w-3xl pb-6 sm:pb-8 lg:pb-12'>
					<h1 className='mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-text-on-hero sm:text-6xl lg:text-7xl'>
						Ofertas em movimento, com acabamento premium.
					</h1>
					<p className='mt-6 max-w-2xl text-base leading-8 text-text-on-hero-muted sm:text-lg'>
						Uma vitrine mais refinada para descobrir produtos, abrir cupons e
						navegar por ofertas com ritmo urbano e leitura limpa.
					</p>
					{selectedCoupon ? (
						<p className='mt-8 inline-flex rounded-full border border-border-on-hero-soft bg-surface-hero-chip px-4 py-2 text-sm text-text-on-hero backdrop-blur-md'>
							Cupom ativo: {selectedCoupon}
						</p>
					) : null}
				</div>
			</div>
		</header>
	);
}
