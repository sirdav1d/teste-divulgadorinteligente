/** @format */

import type { Product } from '@/types/divulgador';

export type CategoryOption = {
	value: string;
	label: string;
	count: number;
};

export type CouponOption = {
	value: string;
	label: string;
	description: string;
	keywords: string[];
};

export type CatalogCategoryOption = CategoryOption;

export type CatalogPageOptions = {
	category?: string | null;
	coupon?: string | null;
	includeCategories?: boolean;
	offset?: number;
	pageSize?: number;
	search?: string | null;
};

export type CatalogPageResult = {
	availableCategories?: CatalogCategoryOption[];
	hasMore: boolean;
	nextOffset: number | null;
	products: Product[];
};

export type CatalogRouteRequest = {
	category: string | null;
	coupon: string | null;
	includeCategories: boolean;
	offset: number;
	search: string | null;
};

export type CatalogRouteErrorCode = 'INVALID_QUERY' | 'CATALOG_UNAVAILABLE';

export type CatalogRouteErrorResponse = {
	error: {
		code: CatalogRouteErrorCode;
		message: string;
		details?: string[];
	};
};
