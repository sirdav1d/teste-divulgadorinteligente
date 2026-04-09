/** @format */

import { cacheLife, cacheTag } from 'next/cache';

import { ALL_CATEGORY_VALUE } from '@/constants/storefront/filters';
import type { CatalogPageOptions } from '@/types/catalog';

import type { RemoteProductsPageRequest } from './query';

function normalizeScopeValue(value?: string | null) {
	const normalizedValue = value?.trim();

	return normalizedValue ? normalizedValue : null;
}

export function applyProductsCachePolicy({
	coupon,
	remoteCategory,
	seller,
}: RemoteProductsPageRequest) {
	const tags = ['catalog-products'];
	const normalizedCoupon = normalizeScopeValue(coupon);
	const normalizedSeller = normalizeScopeValue(seller);

	if (normalizedCoupon) {
		tags.push(`catalog-products:coupon:${normalizedCoupon}`);
	}

	if (remoteCategory) {
		tags.push(`catalog-products:category:${remoteCategory}`);
	}

	if (normalizedSeller) {
		tags.push(`catalog-products:seller:${normalizedSeller}`);
	}

	cacheLife('minutes');
	cacheTag(...tags);
}

export function applyCatalogCategoriesCachePolicy(coupon?: string | null) {
	const tags = ['catalog-categories'];
	const normalizedCoupon = normalizeScopeValue(coupon);

	if (normalizedCoupon) {
		tags.push(`catalog-categories:coupon:${normalizedCoupon}`);
	}

	cacheLife('minutes');
	cacheTag(...tags);
}

export function applyCatalogPageCachePolicy({
	category,
	coupon,
	search,
}: Pick<CatalogPageOptions, 'category' | 'coupon' | 'search'> = {}) {
	const tags = ['catalog-page'];
	const normalizedCoupon = normalizeScopeValue(coupon);
	const normalizedSearch = normalizeScopeValue(search);
	const normalizedCategory = normalizeScopeValue(category);

	if (normalizedCoupon) {
		tags.push(`catalog-page:coupon:${normalizedCoupon}`);
	}

	if (normalizedSearch) {
		tags.push('catalog-page:search');
	}

	if (normalizedCategory && normalizedCategory !== ALL_CATEGORY_VALUE) {
		tags.push(`catalog-page:category:${normalizedCategory}`);
	}

	cacheLife('minutes');
	cacheTag(...tags);
}

export function applyCouponsCachePolicy() {
	cacheLife('minutes');
	cacheTag('catalog-coupons');
}
