/** @format */
'use client';

import { motion } from 'motion/react';

import { useHeroScrollReveal } from '@/hooks/storefront/use-hero-scroll-reveal';

import StorefrontHeroMedia from './storefront-hero-media';

type StorefrontHeroMotionProps = {
	targetId: string;
	posterSrc: string;
	videoSrc: string;
};

export default function StorefrontHeroMotion({
	targetId,
	posterSrc,
	videoSrc,
}: StorefrontHeroMotionProps) {
	const { revealProgress } = useHeroScrollReveal(targetId);

	return (
		<motion.div className='contents'>
			<StorefrontHeroMedia
				posterSrc={posterSrc}
				videoSrc={videoSrc}
				revealProgress={revealProgress}
			/>
		</motion.div>
	);
}
