/** @format */

import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { Product } from '@/types/divulgador';

export type CartLine = {
	product: Product;
	quantity: number;
};

type CartDerivedState = {
	itemCount: number;
	cartQuantities: Readonly<Record<string, number>>;
};

type CartState = CartDerivedState & {
	cartOpen: boolean;
	cartLines: CartLine[];
};

type CartActions = {
	setCartOpen: (open: boolean) => void;
	incrementCart: (product: Product) => void;
	decrementCart: (productId: string) => void;
	clearCart: () => void;
};

export type CartStore = CartState & CartActions;

type CartStoreInitialState = Partial<Pick<CartState, 'cartOpen' | 'cartLines'>>;

function buildCartDerivedState(
	cartLines: readonly CartLine[],
): CartDerivedState {
	return {
		itemCount: cartLines.reduce((sum, line) => sum + line.quantity, 0),
		cartQuantities: cartLines.reduce<Readonly<Record<string, number>>>(
			(accumulator, line) => ({
				...accumulator,
				[line.product.id]: line.quantity,
			}),
			{},
		),
	};
}

function buildCartState(
	cartOpen: boolean,
	cartLines: CartLine[],
): CartState {
	return {
		cartOpen,
		cartLines,
		...buildCartDerivedState(cartLines),
	};
}

const defaultCartState = buildCartState(false, []);

function incrementCartLine(
	currentLines: CartLine[],
	product: Product,
): CartLine[] {
	const existingLine = currentLines.find((line) => line.product.id === product.id);

	if (!existingLine) {
		return [...currentLines, { product, quantity: 1 }];
	}

	return currentLines.map((line) =>
		line.product.id === product.id
			? { ...line, quantity: line.quantity + 1 }
			: line,
	);
}

function decrementCartLine(
	currentLines: CartLine[],
	productId: string,
): CartLine[] {
	return currentLines.flatMap((line) => {
		if (line.product.id !== productId) {
			return [line];
		}

		if (line.quantity <= 1) {
			return [];
		}

		return [{ ...line, quantity: line.quantity - 1 }];
	});
}

export function createCartStore(initialState: CartStoreInitialState = {}) {
	const cartOpen = initialState.cartOpen ?? defaultCartState.cartOpen;
	const cartLines = initialState.cartLines ?? defaultCartState.cartLines;

	return createStore<CartStore>()((set) => ({
		...buildCartState(cartOpen, cartLines),
		setCartOpen: (open) => set({ cartOpen: open }),
		incrementCart: (product) =>
			set((state) => {
				const nextCartLines = incrementCartLine(state.cartLines, product);

				return {
					cartLines: nextCartLines,
					...buildCartDerivedState(nextCartLines),
				};
			}),
		decrementCart: (productId) =>
			set((state) => {
				const nextCartLines = decrementCartLine(state.cartLines, productId);

				return {
					cartLines: nextCartLines,
					...buildCartDerivedState(nextCartLines),
				};
			}),
		clearCart: () => set({
			cartLines: [],
			...buildCartDerivedState([]),
		}),
	}));
}

const cartStore = createCartStore();

export function useCartStore<T>(selector: (state: CartStore) => T) {
	return useStore(cartStore, selector);
}

export function resetCartStore() {
	cartStore.setState(defaultCartState);
}
