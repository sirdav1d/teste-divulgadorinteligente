/** @format */

import type { Product } from '@/types/divulgador';

import type { CatalogFilterState } from './storefront-catalog-request';

export function appendProducts(
	currentProducts: readonly Product[],
	nextProducts: readonly Product[],
) {
	const seen = new Set(currentProducts.map((product) => product.id));
	const appendedProducts = nextProducts.filter((product) => !seen.has(product.id));

	return {
		firstAppendedProductId: appendedProducts[0]?.id ?? null,
		products: [...currentProducts, ...appendedProducts],
	};
}

export function sameFilters(
	left: CatalogFilterState,
	right: CatalogFilterState,
): boolean {
	return (
		left.category === right.category &&
		left.coupon === right.coupon &&
		left.search === right.search
	);
}
