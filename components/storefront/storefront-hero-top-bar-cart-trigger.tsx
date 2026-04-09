/** @format */
'use client';

import { motion } from 'motion/react';

import { useCart } from '@/hooks/storefront/use-cart';
import { useHeroVisibility } from '@/hooks/storefront/use-hero-visibility';

import CartTrigger from '../cart/cart-trigger';

const cartTriggerTransition = {
	type: 'spring',
	stiffness: 420,
	damping: 34,
	mass: 0.9,
} as const;

type StorefrontHeroTopBarCartTriggerProps = {
	targetId: string;
};

export default function StorefrontHeroTopBarCartTrigger({
	targetId,
}: StorefrontHeroTopBarCartTriggerProps) {
	const { isHeroVisible } = useHeroVisibility(targetId);
	const { itemCount, setCartOpen } = useCart();

	if (!isHeroVisible) {
		return null;
	}

	return (
		<motion.div
			layoutId='storefront-cart-trigger'
			transition={cartTriggerTransition}>
			<CartTrigger
				itemCount={itemCount}
				onClick={() => setCartOpen(true)}
				variant='hero'
			/>
		</motion.div>
	);
}
