/** @format */

import { OTHER_CATEGORY_VALUE } from '@/constants/storefront/filters';
import {
	MAX_REMOTE_SCAN_PAGES,
	PAGE_SIZE,
} from '@/constants/storefront/pagination';
import { buildCategoryOptions } from '@/helpers/storefront/category-filters';
import type { CatalogPageOptions, CatalogPageResult } from '@/types/catalog';
import type { Product } from '@/types/divulgador';

import {
	applyCatalogCategoriesCachePolicy,
	applyCatalogPageCachePolicy,
} from './cache-policy';
import { getProductsPage } from './products';
import {
	normalizeLimit,
	normalizeOffset,
	normalizeSearchQuery,
} from './query';
import { scanCatalogPage } from './scan';

async function getAvailableCategories(coupon?: string | null) {
	'use cache';

	applyCatalogCategoriesCachePolicy(coupon);

	const categoryProducts: Product[] = [];
	let offset = 0;
	let pageNumber = 0;

	while (pageNumber < MAX_REMOTE_SCAN_PAGES) {
		const products = await getProductsPage({
			coupon,
			limit: PAGE_SIZE,
			offset,
		});

		if (products.length === 0) {
			return buildCategoryOptions(categoryProducts);
		}

		categoryProducts.push(...products);
		offset += products.length;
		pageNumber += 1;

		if (products.length < PAGE_SIZE) {
			return buildCategoryOptions(categoryProducts);
		}
	}

	return buildCategoryOptions(categoryProducts);
}

export async function getCatalogPage({
	category,
	coupon,
	includeCategories = true,
	offset = 0,
	pageSize = PAGE_SIZE,
	search,
}: CatalogPageOptions = {}): Promise<CatalogPageResult> {
	'use cache';

	applyCatalogPageCachePolicy({ category, coupon, search });

	const normalizedOffset = normalizeOffset(offset);
	const normalizedPageSize = normalizeLimit(pageSize);
	const normalizedSearch = normalizeSearchQuery(search);
	const shouldScanRemotePages =
		Boolean(normalizedSearch) || category?.trim() === OTHER_CATEGORY_VALUE;

	if (!shouldScanRemotePages) {
		const products = await getProductsPage({
			category,
			coupon,
			limit: normalizedPageSize,
			offset: normalizedOffset,
		});
		const availableCategories = includeCategories
			? await getAvailableCategories(coupon)
			: undefined;

		return {
			...(availableCategories ? { availableCategories } : {}),
			products,
			hasMore: products.length === normalizedPageSize,
			nextOffset:
				products.length === normalizedPageSize
					? normalizedOffset + products.length
					: null,
		};
	}

	return scanCatalogPage({
		category,
		coupon,
		includeCategories,
		offset: normalizedOffset,
		pageSize: normalizedPageSize,
		searchQuery: normalizedSearch,
	});
}
