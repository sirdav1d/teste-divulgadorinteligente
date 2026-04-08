/** @format */
'use client';

import type { RefObject } from 'react';

import { useScroll, useTransform } from 'motion/react';

export function useHeroScrollReveal(
	targetRef: RefObject<HTMLElement | null>,
) {
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ['start start', 'end end'],
	});
	const revealProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return {
		revealProgress,
	};
}
