/** @format */

import type { Product } from '@/types/divulgador';

export type CatalogCategoryOption = {
	value: string;
	label: string;
	count: number;
};

export type CatalogPageOptions = {
	category?: string | null;
	coupon?: string | null;
	offset?: number;
	pageSize?: number;
	search?: string | null;
};

export type CatalogPageResult = {
	availableCategories: CatalogCategoryOption[];
	hasMore: boolean;
	nextOffset: number | null;
	products: Product[];
};
