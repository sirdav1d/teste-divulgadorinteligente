/** @format */

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductGrid from '../../components/catalog/product-grid';
import type { Product } from '../../types/divulgador';

function createProduct(index: number): Product {
	return {
		id: `${index}`,
		title: `Produto ${index}`,
		imageUrl: 'https://example.com/product.jpg',
		priceLabel: 'R$ 199,90',
		priceValue: 199.9,
		priceFromLabel: null,
		link: `https://example.com/products/${index}`,
		seller: 'amazon',
		couponCode: null,
		installment: null,
		highlight: false,
		freeShipping: false,
		category: 'beauty',
	};
}

describe('ProductGrid', () => {
	it('shows a load-more action when the catalog still has remote pages', () => {
		const products = Array.from({ length: 12 }, (_, index) =>
			createProduct(index + 1),
		);
		const html = renderToStaticMarkup(
			<ProductGrid
				cartQuantities={{}}
				hasMoreProducts
				onIncrement={() => {}}
				onDecrement={() => {}}
				products={products}
				onLoadMore={() => {}}
			/>,
		);

		expect(html).toContain('Ver mais');
		expect(html).toContain('bg-brand-primary-strong');
		expect(html).toContain('text-surface');
	});

	it('marks the products region busy and exposes a live result summary', () => {
		const html = renderToStaticMarkup(
			<ProductGrid
				cartQuantities={{}}
				isPending
				onIncrement={() => {}}
				onDecrement={() => {}}
				products={Array.from({ length: 4 }, (_, index) =>
					createProduct(index + 1),
				)}
			/>,
		);

		expect(html).toContain('aria-busy="true"');
		expect(html).toContain('role="status"');
		expect(html).toContain('aria-live="polite"');
		expect(html).toContain('aria-atomic="true"');
	});
});
