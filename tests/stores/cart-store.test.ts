/** @format */

import { describe, expect, it } from 'vitest';

import { createCartStore } from '../../stores/storefront/cart-store';
import type { Product } from '../../types/divulgador';

function createProduct(overrides: Partial<Product> = {}): Product {
	return {
		id: 'product-1',
		title: 'Produto 1',
		imageUrl: 'https://example.com/product.jpg',
		priceLabel: 'R$\u00a0199,90',
		priceValue: 199.9,
		priceFromLabel: null,
		link: 'https://example.com/product-1',
		seller: 'amazon',
		couponCode: null,
		installment: null,
		highlight: false,
		freeShipping: false,
		category: 'office',
		...overrides,
	};
}

describe('cart store', () => {
	it('increments, decrements and clears cart lines', () => {
		const store = createCartStore();
		const product = createProduct();

		store.getState().incrementCart(product);
		store.getState().incrementCart(product);

		expect(store.getState().cartLines).toEqual([
			{
				product,
				quantity: 2,
			},
		]);
		expect(store.getState().itemCount).toBe(2);
		expect(store.getState().cartQuantities).toEqual({
			[product.id]: 2,
		});

		store.getState().decrementCart(product.id);

		expect(store.getState().cartLines).toEqual([
			{
				product,
				quantity: 1,
			},
		]);
		expect(store.getState().itemCount).toBe(1);
		expect(store.getState().cartQuantities).toEqual({
			[product.id]: 1,
		});

		store.getState().decrementCart(product.id);

		expect(store.getState().cartLines).toEqual([]);
		expect(store.getState().itemCount).toBe(0);
		expect(store.getState().cartQuantities).toEqual({});

		store.getState().incrementCart(product);
		store.getState().setCartOpen(true);
		store.getState().clearCart();

		expect(store.getState().cartOpen).toBe(true);
		expect(store.getState().cartLines).toEqual([]);
		expect(store.getState().itemCount).toBe(0);
		expect(store.getState().cartQuantities).toEqual({});
	});
});
