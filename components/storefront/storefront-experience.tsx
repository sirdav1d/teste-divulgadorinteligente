/** @format */

'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import type { CatalogPageResult } from '@/types/catalog';
import type { Coupon } from '@/types/divulgador';
import { useCart } from '@/hooks/storefront/use-cart';
import { useHeroVisibility } from '@/hooks/storefront/use-hero-visibility';

import CartSheet from '../cart/cart-sheet';
import CartTrigger from '../cart/cart-trigger';
import StorefrontFooter from './storefront-footer';
import StorefrontCatalogClient from './storefront-catalog-client';
import StorefrontHeader from './storefront-header';

type StorefrontExperienceProps = {
	catalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

export default function StorefrontExperience({
	catalogPage,
	coupons,
	selectedCategory,
	selectedCoupon,
	selectedSearch,
}: StorefrontExperienceProps) {
	const cartTriggerTransition = {
		type: 'spring',
		stiffness: 420,
		damping: 34,
		mass: 0.9,
	} as const;
	const { heroRef, isHeroVisible } = useHeroVisibility();
	const {
		cartOpen,
		setCartOpen,
		cartLines,
		itemCount,
		cartQuantities,
		incrementCart,
		decrementCart,
		clearCart,
	} = useCart();

	return (
		<LayoutGroup id='storefront-cart'>
			<main className='relative min-h-screen'>
				<div className='pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-brand-accent-soft blur-3xl' />
				<div className='pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-accent-soft blur-3xl' />

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

				<StorefrontCatalogClient
					initialCatalogPage={catalogPage}
					cartQuantities={cartQuantities}
					coupons={coupons}
					selectedCategory={selectedCategory}
					selectedCoupon={selectedCoupon}
					selectedSearch={selectedSearch}
					onIncrement={incrementCart}
					onDecrement={decrementCart}
				/>

				<StorefrontFooter />
			</main>

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
