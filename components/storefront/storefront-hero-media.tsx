/** @format */
'use client';

import { useEffect, useRef } from 'react';

import type { MotionValue } from 'motion/react';

import { motion, useTransform } from 'motion/react';

import { HOME_BOOTSTRAP_HERO_READY_EVENT } from '@/helpers/storefront/home-bootstrap-loading';

const HERO_READY_FALLBACK_DELAY_MS = 1200;

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
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const hasDispatchedHeroReadyRef = useRef(false);
	const scale = useTransform(revealProgress, [0, 1], [0.19, 1]);
	const borderRadius = useTransform(revealProgress, [0, 1], [28, 0]);
	const boxShadow = useTransform(
		revealProgress,
		[0, 1],
		['0 30px 110px rgba(7, 17, 38, 0.42)', '0 0px 0px rgba(7, 17, 38, 0)'],
	);

	const dispatchHeroReady = () => {
		if (hasDispatchedHeroReadyRef.current) {
			return;
		}

		hasDispatchedHeroReadyRef.current = true;
		window.dispatchEvent(new Event(HOME_BOOTSTRAP_HERO_READY_EVENT));
	};

	useEffect(() => {
		const videoElement = videoRef.current;

		if (!videoElement) {
			return;
		}

		if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
			dispatchHeroReady();
			return;
		}

		const fallbackTimeoutId = window.setTimeout(() => {
			dispatchHeroReady();
		}, HERO_READY_FALLBACK_DELAY_MS);

		return () => {
			window.clearTimeout(fallbackTimeoutId);
		};
	}, []);

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
					ref={videoRef}
					className='h-full w-full scale-105 object-cover object-center'
					autoPlay
					loop
					muted
					onCanPlay={dispatchHeroReady}
					onLoadedData={dispatchHeroReady}
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
