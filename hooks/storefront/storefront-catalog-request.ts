/** @format */

import {
	ALL_CATEGORY_VALUE,
	ALL_COUPON_VALUE,
} from '@/constants/storefront/filters';
import type { CatalogPageResult } from '@/types/catalog';

export type CatalogFilterState = {
	category: string;
	coupon: string;
	search: string;
};

export function normalizeSearchValue(search: string | null) {
	return search?.trim() ?? '';
}

export function buildCatalogHref(
	pathname: string,
	filters: CatalogFilterState,
) {
	const searchParams = new URLSearchParams();

	if (filters.search) {
		searchParams.set('search', filters.search);
	}

	if (filters.coupon !== ALL_COUPON_VALUE) {
		searchParams.set('coupon', filters.coupon);
	}

	if (filters.category !== ALL_CATEGORY_VALUE) {
		searchParams.set('category', filters.category);
	}

	const query = searchParams.toString();

	return query ? `${pathname}?${query}#catalogo` : `${pathname}#catalogo`;
}

export function buildCatalogRequestUrl(
	offset: number,
	filters: CatalogFilterState,
	includeCategories: boolean,
) {
	const url = new URL('/api/catalog', window.location.origin);

	url.searchParams.set('offset', String(offset));

	if (!includeCategories) {
		url.searchParams.set('includeCategories', '0');
	}

	if (filters.search) {
		url.searchParams.set('search', filters.search);
	}

	if (filters.coupon !== ALL_COUPON_VALUE) {
		url.searchParams.set('coupon', filters.coupon);
	}

	if (filters.category !== ALL_CATEGORY_VALUE) {
		url.searchParams.set('category', filters.category);
	}

	return url.toString();
}

export async function fetchCatalogPage(
	offset: number,
	filters: CatalogFilterState,
	includeCategories: boolean,
	signal?: AbortSignal,
): Promise<CatalogPageResult> {
	const response = await fetch(
		buildCatalogRequestUrl(offset, filters, includeCategories),
		{ signal },
	);

	if (!response.ok) {
		throw new Error(`Catalog request failed with status ${response.status}`);
	}

	return (await response.json()) as CatalogPageResult;
}

export function shouldIncludeCategoriesOnRefresh(
	currentFilters: CatalogFilterState,
	nextFilters: CatalogFilterState,
) {
	return currentFilters.coupon !== nextFilters.coupon;
}

export function isAbortError(error: unknown) {
	return error instanceof DOMException && error.name === 'AbortError';
}
