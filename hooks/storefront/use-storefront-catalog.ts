/** @format */

'use client';

import { useDeferredValue, useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import {
	ALL_CATEGORY_VALUE,
	ALL_COUPON_VALUE,
} from '@/constants/storefront/filters';
import { buildCouponOptions } from '@/helpers/storefront/coupon-filters';
import type {
	CatalogCategoryOption,
	CatalogPageResult,
} from '@/types/catalog';
import type { Coupon, Product } from '@/types/divulgador';

type CatalogFilterState = {
	category: string;
	coupon: string;
	search: string;
};

type UseStorefrontCatalogOptions = {
	initialCatalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

function normalizeSearchValue(search: string | null) {
	return search?.trim() ?? '';
}

function buildCatalogHref(pathname: string, filters: CatalogFilterState) {
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

function buildCatalogRequestUrl(offset: number, filters: CatalogFilterState) {
	const url = new URL('/api/catalog', window.location.origin);

	url.searchParams.set('offset', String(offset));

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

function appendProducts(
	currentProducts: readonly Product[],
	nextProducts: readonly Product[],
) {
	const seen = new Set(currentProducts.map((product) => product.id));

	return [
		...currentProducts,
		...nextProducts.filter((product) => !seen.has(product.id)),
	];
}

function sameFilters(
	left: CatalogFilterState,
	right: CatalogFilterState,
): boolean {
	return (
		left.category === right.category &&
		left.coupon === right.coupon &&
		left.search === right.search
	);
}

async function fetchCatalogPage(
	offset: number,
	filters: CatalogFilterState,
): Promise<CatalogPageResult> {
	const response = await fetch(buildCatalogRequestUrl(offset, filters));

	if (!response.ok) {
		throw new Error(`Catalog request failed with status ${response.status}`);
	}

	return (await response.json()) as CatalogPageResult;
}

export function useStorefrontCatalog({
	initialCatalogPage,
	coupons,
	selectedCategory,
	selectedCoupon,
	selectedSearch,
}: UseStorefrontCatalogOptions) {
	const pathname = usePathname();
	const committedCategory = selectedCategory ?? ALL_CATEGORY_VALUE;
	const committedCoupon = selectedCoupon ?? ALL_COUPON_VALUE;
	const committedSearch = normalizeSearchValue(selectedSearch);
	const [searchQuery, setSearchQuery] = useState(committedSearch);
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const [selectedCategoryValue, setSelectedCategoryValue] =
		useState(committedCategory);
	const [selectedCouponValue, setSelectedCouponValue] = useState(committedCoupon);
	const [loadedProducts, setLoadedProducts] = useState(initialCatalogPage.products);
	const [availableCategories, setAvailableCategories] = useState<
		CatalogCategoryOption[]
	>(initialCatalogPage.availableCategories);
	const [hasMoreProducts, setHasMoreProducts] = useState(
		initialCatalogPage.hasMore,
	);
	const [nextOffset, setNextOffset] = useState(initialCatalogPage.nextOffset);
	const [isRefreshingCatalog, setIsRefreshingCatalog] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const lastAppliedFiltersRef = useRef<CatalogFilterState>({
		category: committedCategory,
		coupon: committedCoupon,
		search: committedSearch,
	});
	const requestSequenceRef = useRef(0);

	function refreshCatalog(nextFilters: CatalogFilterState) {
		const requestId = ++requestSequenceRef.current;

		setIsRefreshingCatalog(true);

		void fetchCatalogPage(0, nextFilters)
			.then((catalogPage) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				setLoadedProducts(catalogPage.products);
				setAvailableCategories(catalogPage.availableCategories);
				setHasMoreProducts(catalogPage.hasMore);
				setNextOffset(catalogPage.nextOffset);
			})
			.finally(() => {
				if (requestId === requestSequenceRef.current) {
					setIsRefreshingCatalog(false);
				}
			});
	}

	useEffect(() => {
		const nextFilters = {
			category: selectedCategoryValue,
			coupon: selectedCouponValue,
			search: deferredSearchQuery.trim(),
		};

		if (sameFilters(nextFilters, lastAppliedFiltersRef.current)) {
			return;
		}

		lastAppliedFiltersRef.current = nextFilters;
		window.history.replaceState(
			null,
			'',
			buildCatalogHref(pathname, nextFilters),
		);
		queueMicrotask(() => {
			refreshCatalog(nextFilters);
		});
	}, [deferredSearchQuery, pathname, selectedCategoryValue, selectedCouponValue]);

	const availableCoupons = buildCouponOptions(coupons);
	const shouldShowGrid = loadedProducts.length > 0 || isRefreshingCatalog;

	function handleLoadMore() {
		if (isLoadingMore || nextOffset === null || !hasMoreProducts) {
			return;
		}

		const requestId = ++requestSequenceRef.current;
		const nextFilters = {
			category: selectedCategoryValue,
			coupon: selectedCouponValue,
			search: deferredSearchQuery.trim(),
		};

		setIsLoadingMore(true);

		void fetchCatalogPage(nextOffset, nextFilters)
			.then((catalogPage) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				setLoadedProducts((currentProducts) =>
					appendProducts(currentProducts, catalogPage.products),
				);
				setAvailableCategories(catalogPage.availableCategories);
				setHasMoreProducts(catalogPage.hasMore);
				setNextOffset(catalogPage.nextOffset);
			})
			.finally(() => {
				if (requestId === requestSequenceRef.current) {
					setIsLoadingMore(false);
				}
			});
	}

	return {
		searchQuery,
		selectedCategoryValue,
		selectedCouponValue,
		loadedProducts,
		hasMoreProducts,
		isRefreshingCatalog,
		isLoadingMore,
		availableCategories,
		availableCoupons,
		shouldShowGrid,
		setSearchQuery,
		setSelectedCategoryValue,
		setSelectedCouponValue,
		handleLoadMore,
	};
}
