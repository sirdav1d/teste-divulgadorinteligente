/** @format */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import type { Coupon, Product } from '@/lib/types/divulgador';

import CartSheet from '../cart/cart-sheet';
import CartTrigger from '../cart/cart-trigger';
import StorefrontFooter from './storefront-footer';
import StorefrontCatalogClient from './storefront-catalog-client';
import StorefrontHeader from './storefront-header';

type CartLine = {
	product: Product;
	quantity: number;
};

type StorefrontExperienceProps = {
	coupons: readonly Coupon[];
	products: readonly Product[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
};

export default function StorefrontExperience({
	coupons,
	products,
	selectedCategory,
	selectedCoupon,
}: StorefrontExperienceProps) {
	const cartTriggerTransition = {
		type: 'spring',
		stiffness: 420,
		damping: 34,
		mass: 0.9,
	} as const;
	const heroRef = useRef<HTMLDivElement>(null);
	const [cartOpen, setCartOpen] = useState(false);
	const [cartLines, setCartLines] = useState<CartLine[]>([]);
	const [isHeroVisible, setIsHeroVisible] = useState(true);

	const itemCount = useMemo(
		() => cartLines.reduce((sum, line) => sum + line.quantity, 0),
		[cartLines],
	);

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

	function handleAddToCart(product: Product) {
		setCartLines((currentLines) => {
			const existingLine = currentLines.find((line) => line.product.id === product.id);

			if (!existingLine) {
				return [...currentLines, { product, quantity: 1 }];
			}

			return currentLines.map((line) =>
				line.product.id === product.id
					? { ...line, quantity: line.quantity + 1 }
					: line,
			);
		});
	}

	function handleRemoveFromCart(productId: string) {
		setCartLines((currentLines) =>
			currentLines.filter((line) => line.product.id !== productId),
		);
	}

	function handleClearCart() {
		setCartLines([]);
	}

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
					products={products}
					coupons={coupons}
					selectedCategory={selectedCategory}
					selectedCoupon={selectedCoupon}
					onAddToCart={handleAddToCart}
				/>

				<StorefrontFooter />
			</main>

			<CartSheet
				lines={cartLines}
				open={cartOpen}
				onClear={handleClearCart}
				onOpenChange={setCartOpen}
				onRemove={handleRemoveFromCart}
			/>
		</LayoutGroup>
	);
}
