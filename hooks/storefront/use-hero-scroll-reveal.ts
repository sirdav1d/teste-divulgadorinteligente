/** @format */
'use client';

import { useEffect, useRef } from 'react';

import { useScroll, useTransform } from 'motion/react';

export function useHeroScrollReveal(targetId: string) {
	const targetRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		targetRef.current = document.getElementById(targetId);

		return () => {
			targetRef.current = null;
		};
	}, [targetId]);

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ['start start', 'end end'],
	});
	const revealProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return {
		revealProgress,
	};
}
