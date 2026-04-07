/** @format */
/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import StorefrontHeroMedia from './storefront-hero-media';

type StorefrontHeaderProps = {
	topBarSlot?: ReactNode;
};

const StorefrontHeader = forwardRef<HTMLElement, StorefrontHeaderProps>(
	function StorefrontHeader({ topBarSlot = null }, ref) {
		return (
			<header
				ref={ref}
				className='relative min-h-svh overflow-hidden bg-brand-primary text-text-on-hero shadow-(--shadow-float)'>
				<StorefrontHeroMedia
					posterSrc='/images/storefront-hero-poster.jpg'
					videoSrc='/videos/storefront-hero.mp4'
				/>

				<div className='relative mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:px-10'>
					<div className='flex min-h-svh flex-col justify-between py-6 sm:py-8 lg:py-10'>
						<div className='flex items-center justify-between gap-4'>
							<img
								src='/brand/divulgador-inteligente-logo.svg'
								alt='Divulgador Inteligente'
								width={194}
								height={70}
								decoding='async'
								fetchPriority='high'
								className='h-9 w-auto sm:h-10'
							/>
							{topBarSlot}
						</div>

						<div className='max-w-3xl pb-6 sm:pb-8 lg:pb-12'>
							<h1 className='mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-text-on-hero sm:text-6xl lg:text-7xl'>
								Ofertas em movimento, com acabamento premium.
							</h1>
							<p className='mt-6 max-w-2xl text-base leading-8 text-text-on-hero-muted sm:text-lg'>
								Uma vitrine mais refinada para descobrir produtos, abrir cupons e
								navegar por ofertas com ritmo urbano e leitura limpa.
							</p>
						</div>
					</div>
				</div>
			</header>
		);
	},
);

export default StorefrontHeader;
