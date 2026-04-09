/** @format */
'use client';

import type { MotionValue } from 'motion/react';

import { motion, useTransform } from 'motion/react';

type StorefrontHeroMediaProps = {
	posterSrc: string;
	videoSrc: string;
	revealProgress: MotionValue<number>;
};

export default function StorefrontHeroMedia({
	posterSrc,
	videoSrc,
	revealProgress,
}: StorefrontHeroMediaProps) {
	const scale = useTransform(revealProgress, [0, 1], [0.19, 1]);
	const borderRadius = useTransform(revealProgress, [0, 1], [28, 0]);
	const boxShadow = useTransform(
		revealProgress,
		[0, 1],
		['0 30px 110px rgba(7, 17, 38, 0.42)', '0 0px 0px rgba(7, 17, 38, 0)'],
	);

	return (
		<div className='absolute inset-0 overflow-hidden'>
			<motion.div
				aria-hidden='true'
				className='absolute inset-0 overflow-hidden will-change-transform'
				style={{
					scale,
					borderRadius,
					boxShadow,
					transformOrigin: 'center center',
				}}>
				<video
					className='h-full w-full scale-105 object-cover object-center'
					autoPlay
					loop
					muted
					playsInline
					poster={posterSrc}
					preload='metadata'>
					<source
						src={videoSrc}
						type='video/mp4'
					/>
				</video>
			</motion.div>
		</div>
	);
}
