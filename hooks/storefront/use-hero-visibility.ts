/** @format */

import { useEffect, useState } from 'react';

export function useHeroVisibility(targetId: string) {
	const [isHeroVisible, setIsHeroVisible] = useState(true);

	useEffect(() => {
		const heroElement = document.getElementById(targetId);

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
	}, [targetId]);

	return {
		isHeroVisible,
	};
}
