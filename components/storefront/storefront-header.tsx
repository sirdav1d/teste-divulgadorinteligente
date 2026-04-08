/** @format */
'use client';
/* eslint-disable @next/next/no-img-element */

import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

import { useHeroScrollReveal } from '@/hooks/storefront/use-hero-scroll-reveal';

import StorefrontHeroMedia from './storefront-hero-media';

type StorefrontHeaderProps = {
	topBarSlot?: ReactNode;
};

const heroTitleTransition = {
	duration: 0.5,
	ease: [0.22, 1, 0.36, 1],
} as const;

const heroTitleVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.11,
			delayChildren: 0.04,
		},
	},
};

const heroWordVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		filter: 'blur(10px)',
	},
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: heroTitleTransition,
	},
};

function assignForwardedRef(
	ref: ForwardedRef<HTMLElement>,
	node: HTMLElement | null,
) {
	if (typeof ref === 'function') {
		ref(node);
		return;
	}

	if (ref) {
		ref.current = node;
	}
}

const StorefrontHeader = forwardRef<HTMLElement, StorefrontHeaderProps>(
	function StorefrontHeader({ topBarSlot = null }, ref) {
		const headerRef = useRef<HTMLElement | null>(null);
		const { revealProgress } = useHeroScrollReveal(headerRef);
		const handleHeaderRef = useCallback(
			(node: HTMLElement | null) => {
				headerRef.current = node;
				assignForwardedRef(ref, node);
			},
			[ref],
		);

		return (
			<header
				ref={handleHeaderRef}
				className='relative min-h-[200dvh] bg-brand-primary text-text-on-hero shadow-(--shadow-float)'>
				<div className='sticky top-0 min-h-dvh overflow-hidden'>
					<StorefrontHeroMedia
						posterSrc='/images/storefront-hero-poster.jpg'
						videoSrc='/videos/storefront-hero.mp4'
						revealProgress={revealProgress}
					/>

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
								<motion.h1
									initial='hidden'
									animate='visible'
									variants={heroTitleVariants}
									className='mt-6 flex flex-col gap-2 font-hero-display text-5xl leading-[0.92] tracking-[-0.06em] text-text-on-hero sm:gap-3 sm:text-6xl lg:text-9xl'>
									<motion.span
										variants={heroWordVariants}
										className='w-fit'>
										Divulgue.
									</motion.span>
									<motion.span
										variants={heroWordVariants}
										className='w-fit self-center'>
										Venda.
									</motion.span>
									<motion.span
										variants={heroWordVariants}
										className='w-fit self-end'>
										{'Cres\u00e7a.'}
									</motion.span>
								</motion.h1>
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	},
);

export default StorefrontHeader;
