/** @format */

import { MAX_REMOTE_SCAN_PAGES, PAGE_SIZE } from '@/constants/storefront/pagination';
import type { CatalogPageResult } from '@/types/catalog';
import type { Product } from '@/types/divulgador';

import { buildCategoryOptions } from './categories';
import { getProductsPage } from './products';
import { matchesSearchQuery, matchesSelectedCategory } from './query';

type ScanCatalogPageOptions = {
	category?: string | null;
	coupon?: string | null;
	includeCategories: boolean;
	offset: number;
	pageSize: number;
	searchQuery: string;
};

export async function scanCatalogPage({
	category,
	coupon,
	includeCategories,
	offset,
	pageSize,
	searchQuery,
}: ScanCatalogPageOptions): Promise<CatalogPageResult> {
	const matchedProducts: Product[] = [];
	const categoryProducts: Product[] = [];
	let nextRemoteOffset = offset;
	let pageNumber = 0;

	while (
		pageNumber < MAX_REMOTE_SCAN_PAGES &&
		(includeCategories || matchedProducts.length < pageSize)
	) {
		const products = await getProductsPage({
			category,
			coupon,
			limit: PAGE_SIZE,
			offset: nextRemoteOffset,
		});

		if (products.length === 0) {
			return {
				...(includeCategories
					? { availableCategories: buildCategoryOptions(categoryProducts) }
					: {}),
				products: matchedProducts.slice(0, pageSize),
				hasMore: false,
				nextOffset: null,
			};
		}

		if (includeCategories) {
			categoryProducts.push(...products);
		}

		matchedProducts.push(
			...products.filter(
				(product) =>
					matchesSelectedCategory(product, category) &&
					matchesSearchQuery(product, searchQuery),
			),
		);
		nextRemoteOffset += products.length;
		pageNumber += 1;

		if (products.length < PAGE_SIZE) {
			return {
				...(includeCategories
					? { availableCategories: buildCategoryOptions(categoryProducts) }
					: {}),
				products: matchedProducts.slice(0, pageSize),
				hasMore: false,
				nextOffset: null,
			};
		}
	}

	return {
		...(includeCategories
			? { availableCategories: buildCategoryOptions(categoryProducts) }
			: {}),
		products: matchedProducts.slice(0, pageSize),
		hasMore: true,
		nextOffset: nextRemoteOffset,
	};
}
