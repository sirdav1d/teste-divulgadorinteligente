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
		<header className='relative min-h-svh overflow-hidden bg-brand-primary text-text-on-hero shadow-(--shadow-float)'>
			<StorefrontHeroMedia
				posterSrc='/images/storefront-hero-poster.jpg'
				videoSrc='/videos/storefront-hero.mp4'
			/>

			<div className='relative mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:px-10'>
				<div className='flex min-h-svh flex-col justify-between py-6 sm:py-8 lg:py-10'>
					<div className='flex items-center'>
						<Image
							src='/brand/divulgador-inteligente-logo.svg'
							alt='Divulgador Inteligente'
							width={194}
							height={70}
							unoptimized
							priority
							sizes='194px'
							className='h-8 w-auto sm:h-9'
						/>
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
			</div>
		</header>
	);
}
