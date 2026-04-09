/** @format */

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import CartSheet from '../../components/cart/cart-sheet';
import type { Product } from '../../types/divulgador';

function createProduct(overrides: Partial<Product> = {}): Product {
	return {
		id: '1',
		title: 'cropped gola alta com zipper ace marrom',
		imageUrl: 'https://example.com/product.jpg',
		priceLabel: 'R$\u00a077,99',
		priceValue: 77.99,
		priceFromLabel: null,
		link: 'https://example.com/products/1',
		seller: 'cea',
		couponCode: 'VEM35',
		installment: null,
		highlight: false,
		freeShipping: false,
		category: 'fashion',
		...overrides,
	};
}

function renderCartSheet(
	lines = [] as Array<{ product: Product; quantity: number }>,
) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(
			<CartSheet
				lines={lines}
				open
				onClear={() => {}}
				onOpenChange={() => {}}
				onIncrement={() => {}}
				onDecrement={() => {}}
			/>,
		);
	});

	return {
		cleanup() {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('CartSheet', () => {
	it('renders the shadcn empty state directly in the cart body when there are no items', () => {
		const view = renderCartSheet();
		const sheetContent = document.body.querySelector(
			'[data-slot="sheet-content"]',
		);

		expect(sheetContent).not.toBeNull();

		const emptyState = sheetContent!.querySelector('[data-slot="empty"]');

		expect(emptyState).not.toBeNull();
		expect(emptyState?.textContent).toContain(
			'O carrinho ainda está vazio',
		);

		view.cleanup();
	});

	it('renders quantity detail and highlighted line total for priced items', () => {
		const view = renderCartSheet([
			{
				product: createProduct(),
				quantity: 6,
			},
		]);
		const line = document.body.querySelector('article');

		expect(document.body.textContent).toContain('6 x R$\u00a077,99');
		expect(document.body.textContent).toContain('R$\u00a0467,94');
		expect(line).not.toBeNull();

		view.cleanup();
	});
});
