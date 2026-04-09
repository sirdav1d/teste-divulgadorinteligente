/** @format */

'use client';

import type { ReactNode } from 'react';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import { useCart } from '@/hooks/storefront/use-cart';
import { useHeroVisibility } from '@/hooks/storefront/use-hero-visibility';

import CartSheet from '../cart/cart-sheet';
import CartTrigger from '../cart/cart-trigger';

const cartTriggerTransition = {
	type: 'spring',
	stiffness: 420,
	damping: 34,
	mass: 0.9,
} as const;

type StorefrontHeroClientProps = {
	children: ReactNode;
	targetId: string;
};

export default function StorefrontHeroClient({
	children,
	targetId,
}: StorefrontHeroClientProps) {
	const { isHeroVisible } = useHeroVisibility(targetId);
	const {
		cartOpen,
		setCartOpen,
		cartLines,
		itemCount,
		incrementCart,
		decrementCart,
		clearCart,
	} = useCart();

	return (
		<LayoutGroup id='storefront-cart'>
			{children}

			<AnimatePresence initial={false}>
				{!isHeroVisible ? (
					<motion.div
						layoutId='storefront-cart-trigger'
						layoutRoot
						className='fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6'
						transition={cartTriggerTransition}>
						<CartTrigger
							itemCount={itemCount}
							onClick={() => setCartOpen(true)}
							variant='floating'
						/>
					</motion.div>
				) : null}
			</AnimatePresence>

			<CartSheet
				lines={cartLines}
				open={cartOpen}
				onClear={clearCart}
				onOpenChange={setCartOpen}
				onIncrement={incrementCart}
				onDecrement={decrementCart}
			/>
		</LayoutGroup>
	);
}
