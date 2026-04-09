/** @format */

import {
	ALL_CATEGORY_VALUE,
	OTHER_CATEGORY_VALUE,
} from '@/constants/storefront/filters';
import { PAGE_SIZE } from '@/constants/storefront/pagination';
import type { Product } from '@/types/divulgador';

import { isOtherCategory } from './categories';

export type FetchProductsPageOptions = {
	category?: string | null;
	coupon?: string | null;
	limit?: number;
	offset?: number;
	seller?: string;
};

export type RemoteProductsPageRequest = {
	coupon?: string;
	limit: number;
	offset: number;
	remoteCategory?: string;
	seller?: string;
};

export function normalizeOffset(offset?: number) {
	return Number.isFinite(offset) && (offset ?? 0) > 0
		? Math.floor(offset as number)
		: 0;
}

export function normalizeLimit(limit?: number) {
	return Number.isFinite(limit) && (limit ?? 0) > 0
		? Math.floor(limit as number)
		: PAGE_SIZE;
}

export function normalizeSearchQuery(search?: string | null) {
	return search?.trim().toLocaleLowerCase('pt-BR') ?? '';
}

export function shouldUseRemoteCategory(category?: string | null) {
	if (!category) {
		return null;
	}

	const normalizedCategory = category.trim();

	if (
		!normalizedCategory ||
		normalizedCategory === ALL_CATEGORY_VALUE ||
		normalizedCategory === OTHER_CATEGORY_VALUE
	) {
		return null;
	}

	return normalizedCategory;
}

export function matchesSelectedCategory(
	product: Product,
	selectedCategory?: string | null,
) {
	const normalizedCategory = selectedCategory?.trim();

	if (!normalizedCategory || normalizedCategory === ALL_CATEGORY_VALUE) {
		return true;
	}

	if (normalizedCategory === OTHER_CATEGORY_VALUE) {
		return isOtherCategory(product.category);
	}

	return product.category?.trim() === normalizedCategory;
}

export function matchesSearchQuery(product: Product, searchQuery: string) {
	if (!searchQuery) {
		return true;
	}

	return product.title.toLocaleLowerCase('pt-BR').includes(searchQuery);
}

function normalizeScopedValue(value?: string | null) {
	const normalizedValue = value?.trim();

	return normalizedValue ? normalizedValue : undefined;
}

export function createRemoteProductsPageRequest({
	category,
	coupon,
	limit,
	offset,
	seller,
}: FetchProductsPageOptions = {}): RemoteProductsPageRequest {
	return {
		coupon: normalizeScopedValue(coupon),
		limit: normalizeLimit(limit),
		offset: normalizeOffset(offset),
		remoteCategory: shouldUseRemoteCategory(category) ?? undefined,
		seller: normalizeScopedValue(seller),
	};
}
