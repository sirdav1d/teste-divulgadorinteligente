/** @format */

import StorefrontHeaderShell from './storefront-header-shell';
import StorefrontHeroMotion from './storefront-hero-motion';
import StorefrontHeroTopBarCartTrigger from './storefront-hero-top-bar-cart-trigger';

type StorefrontHeaderProps = {
	heroId: string;
};

export default function StorefrontHeader({ heroId }: StorefrontHeaderProps) {
	return (
		<StorefrontHeaderShell
			heroId={heroId}
			mediaSlot={
				<StorefrontHeroMotion
					targetId={heroId}
					posterSrc='/images/storefront-hero-poster.jpg'
					videoSrc='/videos/storefront-hero.mp4'
				/>
			}
			topBarSlot={<StorefrontHeroTopBarCartTrigger targetId={heroId} />}
		/>
	);
}
