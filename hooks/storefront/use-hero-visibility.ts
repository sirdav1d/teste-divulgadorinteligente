/** @format */

import { useEffect, useRef, useState } from 'react';

export function useHeroVisibility() {
	const heroRef = useRef<HTMLDivElement>(null);
	const [isHeroVisible, setIsHeroVisible] = useState(true);

	useEffect(() => {
		const heroElement = heroRef.current;

		if (!heroElement || typeof IntersectionObserver === 'undefined') {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsHeroVisible(entry.isIntersecting);
			},
			{
				rootMargin: '-72px 0px -45% 0px',
				threshold: 0.1,
			},
		);

		observer.observe(heroElement);

		return () => {
			observer.disconnect();
		};
	}, []);

	return {
		heroRef,
		isHeroVisible,
	};
}
