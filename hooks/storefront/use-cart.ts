/** @format */

import { useMemo, useState } from 'react';

import type { Product } from '@/types/divulgador';

type CartLine = {
	product: Product;
	quantity: number;
};

export function useCart() {
	const [cartOpen, setCartOpen] = useState(false);
	const [cartLines, setCartLines] = useState<CartLine[]>([]);

	const itemCount = useMemo(
		() => cartLines.reduce((sum, line) => sum + line.quantity, 0),
		[cartLines],
	);
	const cartQuantities = useMemo(
		() =>
			cartLines.reduce<Readonly<Record<string, number>>>(
				(accumulator, line) => ({
					...accumulator,
					[line.product.id]: line.quantity,
				}),
				{},
			),
		[cartLines],
	);

	function incrementCart(product: Product) {
		setCartLines((currentLines) => {
			const existingLine = currentLines.find(
				(line) => line.product.id === product.id,
			);

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

	function decrementCart(productId: string) {
		setCartLines((currentLines) =>
			currentLines.flatMap((line) => {
				if (line.product.id !== productId) {
					return [line];
				}

				if (line.quantity <= 1) {
					return [];
				}

				return [{ ...line, quantity: line.quantity - 1 }];
			}),
		);
	}

	function clearCart() {
		setCartLines([]);
	}

	return {
		cartOpen,
		setCartOpen,
		cartLines,
		itemCount,
		cartQuantities,
		incrementCart,
		decrementCart,
		clearCart,
	};
}
