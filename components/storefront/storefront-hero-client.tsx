/** @format */

'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useCart } from '@/hooks/storefront/use-cart';
import { useHeroVisibility } from '@/hooks/storefront/use-hero-visibility';
import CartSheet from '../cart/cart-sheet';
import CartTrigger from '../cart/cart-trigger';
import StorefrontHeader from './storefront-header';

const cartTriggerTransition = {
	type: 'spring',
	stiffness: 420,
	damping: 34,
	mass: 0.9,
} as const;

export default function StorefrontHeroClient() {
	const { heroRef, isHeroVisible } = useHeroVisibility();
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
			<StorefrontHeader
				ref={heroRef}
				topBarSlot={
					isHeroVisible ? (
						<motion.div
							layoutId='storefront-cart-trigger'
							transition={cartTriggerTransition}>
							<CartTrigger
								itemCount={itemCount}
								onClick={() => setCartOpen(true)}
								variant='hero'
							/>
						</motion.div>
					) : null
				}
			/>

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
