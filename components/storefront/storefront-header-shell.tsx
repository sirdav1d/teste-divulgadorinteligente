/** @format */
/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from 'react';

type StorefrontHeaderShellProps = {
	heroId: string;
	mediaSlot?: ReactNode;
	topBarSlot?: ReactNode;
};

export default function StorefrontHeaderShell({
	heroId,
	mediaSlot = null,
	topBarSlot = null,
}: StorefrontHeaderShellProps) {
	return (
		<header
			id={heroId}
			className='relative min-h-[200dvh] bg-brand-primary text-text-on-hero shadow-(--shadow-float)'>
			<div className='sticky top-0 min-h-dvh overflow-hidden'>
				{mediaSlot}

				<div className='relative mx-auto w-full max-w-368 px-4 sm:px-6 lg:px-8 xl:px-10'>
					<div className='flex min-h-dvh flex-col justify-between py-6 sm:py-8 lg:py-10'>
						<div className='flex items-center justify-between gap-4'>
							<img
								src='/brand/divulgador-inteligente-logo.svg'
								alt='Divulgador Inteligente'
								width={194}
								height={70}
								decoding='async'
								fetchPriority='high'
								className='h-11 w-auto bg-blend-darken sm:h-12'
							/>
							{topBarSlot}
						</div>

						<div className='max-w-full pb-6 sm:pb-8 lg:pb-12'>
							<h1 className='mt-6 flex flex-col gap-2 font-hero-display text-5xl leading-[0.92] tracking-[.02em] text-text-on-hero sm:gap-3 sm:text-6xl lg:text-9xl'>
								<span className='w-fit'>Divulgue.</span>
								<span className='w-fit self-center'>Venda.</span>
								<span className='w-fit self-end'>Cresça.</span>
							</h1>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
