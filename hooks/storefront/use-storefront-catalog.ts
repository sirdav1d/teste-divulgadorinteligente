/** @format */

'use client';

import {
	useDeferredValue,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from 'react';

import { usePathname } from 'next/navigation';

import {
	ALL_CATEGORY_VALUE,
	ALL_COUPON_VALUE,
} from '@/constants/storefront/filters';
import { buildCouponOptions } from '@/helpers/storefront/coupon-filters';
import type { CategoryOption, CatalogPageResult } from '@/types/catalog';
import type { Coupon } from '@/types/divulgador';

import {
	buildCatalogHref,
	fetchCatalogPage,
	isAbortError,
	normalizeSearchValue,
	shouldIncludeCategoriesOnRefresh,
	type CatalogFilterState,
} from './storefront-catalog-request';
import { appendProducts, sameFilters } from './storefront-catalog-state';

type UseStorefrontCatalogOptions = {
	initialCatalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

const CATALOG_REFRESH_ERROR_MESSAGE =
	'Não foi possível atualizar o catálogo agora. Tente novamente.';

function getCatalogScrollBehavior(): ScrollBehavior {
	if (
		typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		return 'auto';
	}

	return 'smooth';
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
		CategoryOption[]
	>(initialCatalogPage.availableCategories ?? []);
	const [hasMoreProducts, setHasMoreProducts] = useState(
		initialCatalogPage.hasMore,
	);
	const [nextOffset, setNextOffset] = useState(initialCatalogPage.nextOffset);
	const [isRefreshingCatalog, setIsRefreshingCatalog] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [catalogError, setCatalogError] = useState<string | null>(null);
	const committedFiltersRef = useRef<CatalogFilterState>({
		category: committedCategory,
		coupon: committedCoupon,
		search: committedSearch,
	});
	const refreshAbortControllerRef = useRef<AbortController | null>(null);
	const pendingScrollProductIdRef = useRef<string | null>(null);
	const requestSequenceRef = useRef(0);

	function restoreCommittedFilters() {
		const committedFilters = committedFiltersRef.current;

		setSearchQuery(committedFilters.search);
		setSelectedCategoryValue(committedFilters.category);
		setSelectedCouponValue(committedFilters.coupon);
	}

	const refreshCatalog = useEffectEvent(function refreshCatalog(
		nextFilters: CatalogFilterState,
		includeCategories: boolean,
	) {
		const requestId = ++requestSequenceRef.current;
		refreshAbortControllerRef.current?.abort();
		const abortController = new AbortController();
		refreshAbortControllerRef.current = abortController;
		pendingScrollProductIdRef.current = null;

		setCatalogError(null);
		setIsRefreshingCatalog(true);

		void fetchCatalogPage(
			0,
			nextFilters,
			includeCategories,
			abortController.signal,
		)
			.then((catalogPage) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				committedFiltersRef.current = nextFilters;
				setLoadedProducts(catalogPage.products);
				if (catalogPage.availableCategories) {
					setAvailableCategories(catalogPage.availableCategories);
				}
				setHasMoreProducts(catalogPage.hasMore);
				setNextOffset(catalogPage.nextOffset);
				window.history.replaceState(
					null,
					'',
					buildCatalogHref(pathname, nextFilters),
				);
			})
			.catch((error) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				if (isAbortError(error)) {
					return;
				}

				restoreCommittedFilters();
				setCatalogError(CATALOG_REFRESH_ERROR_MESSAGE);
			})
			.finally(() => {
				if (requestId === requestSequenceRef.current) {
					if (refreshAbortControllerRef.current === abortController) {
						refreshAbortControllerRef.current = null;
					}
					setIsRefreshingCatalog(false);
				}
			});
	});

	useEffect(() => {
		return () => {
			refreshAbortControllerRef.current?.abort();
		};
	}, []);

	useEffect(() => {
		const targetProductId = pendingScrollProductIdRef.current;

		if (!targetProductId) {
			return;
		}

		const targetElement = document.querySelector<HTMLElement>(
			`[data-product-id="${targetProductId}"]`,
		);

		if (!targetElement) {
			return;
		}

		pendingScrollProductIdRef.current = null;

		const animationFrameId = window.requestAnimationFrame(() => {
			targetElement.scrollIntoView({
				behavior: getCatalogScrollBehavior(),
				block: 'start',
			});
		});

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [loadedProducts]);

	useEffect(() => {
		const nextFilters = {
			category: selectedCategoryValue,
			coupon: selectedCouponValue,
			search: deferredSearchQuery.trim(),
		};
		const currentFilters = committedFiltersRef.current;

		if (sameFilters(nextFilters, currentFilters)) {
			return;
		}

		const includeCategories = shouldIncludeCategoriesOnRefresh(
			currentFilters,
			nextFilters,
		);
		queueMicrotask(() => {
			refreshCatalog(nextFilters, includeCategories);
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

		setCatalogError(null);
		setIsLoadingMore(true);

		void fetchCatalogPage(nextOffset, nextFilters, false)
			.then((catalogPage) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				setLoadedProducts((currentProducts) => {
					const nextLoadedProducts = appendProducts(
						currentProducts,
						catalogPage.products,
					);

					pendingScrollProductIdRef.current =
						nextLoadedProducts.firstAppendedProductId;

					return nextLoadedProducts.products;
				});
				setHasMoreProducts(catalogPage.hasMore);
				setNextOffset(catalogPage.nextOffset);
			})
			.catch((error) => {
				if (requestId !== requestSequenceRef.current) {
					return;
				}

				if (isAbortError(error)) {
					return;
				}

				setCatalogError(CATALOG_REFRESH_ERROR_MESSAGE);
			})
			.finally(() => {
				setIsLoadingMore(false);
			});
	}

	return {
		catalogError,
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
