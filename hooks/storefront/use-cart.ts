/** @format */

import type { CartStore } from '@/stores/storefront/cart-store';
import { useCartStore } from '@/stores/storefront/cart-store';

const selectCartOpen = (state: CartStore) => state.cartOpen;
const selectSetCartOpen = (state: CartStore) => state.setCartOpen;
const selectCartLines = (state: CartStore) => state.cartLines;
const selectItemCount = (state: CartStore) => state.itemCount;
const selectCartQuantities = (state: CartStore) => state.cartQuantities;
const selectIncrementCart = (state: CartStore) => state.incrementCart;
const selectDecrementCart = (state: CartStore) => state.decrementCart;
const selectClearCart = (state: CartStore) => state.clearCart;

export function useCart() {
	const cartOpen = useCartStore(selectCartOpen);
	const setCartOpen = useCartStore(selectSetCartOpen);
	const cartLines = useCartStore(selectCartLines);
	const itemCount = useCartStore(selectItemCount);
	const cartQuantities = useCartStore(selectCartQuantities);
	const incrementCart = useCartStore(selectIncrementCart);
	const decrementCart = useCartStore(selectDecrementCart);
	const clearCart = useCartStore(selectClearCart);

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
