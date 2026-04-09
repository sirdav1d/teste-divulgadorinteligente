/** @format */

import { SITE_NAME } from '@/constants/divulgador/api';
import { normalizeProduct } from '@/helpers/divulgador/normalizers';
import { buildDivulgadorUrl } from '@/helpers/divulgador/build-url';
import type { DivulgadorProductAttributes } from '@/types/divulgador';

import { applyProductsCachePolicy } from './cache-policy';
import type {
	FetchProductsPageOptions,
	RemoteProductsPageRequest,
} from './query';
import { createRemoteProductsPageRequest } from './query';
import { fetchCollection } from './request';

type GetProductsByCouponOptions = {
	coupon: string;
	seller?: string;
};

async function getCachedProductsPage({
	coupon,
	limit,
	offset,
	remoteCategory,
	seller,
}: RemoteProductsPageRequest) {
	'use cache';

	applyProductsCachePolicy({ coupon, limit, offset, remoteCategory, seller });

	const searchParams = new URLSearchParams({
		sitename: SITE_NAME,
		start: String(offset),
		limit: String(limit),
	});

	if (coupon) {
		searchParams.set('coupon', coupon);
	}

	if (remoteCategory) {
		searchParams.set('category', remoteCategory);
	}

	if (seller) {
		searchParams.append('sellers[]', seller);
	}

	const payload = await fetchCollection<DivulgadorProductAttributes>(
		buildDivulgadorUrl('/products', searchParams),
	);

	return payload.data.map(normalizeProduct);
}

export async function getProductsPage(options: FetchProductsPageOptions = {}) {
	return getCachedProductsPage(createRemoteProductsPageRequest(options));
}

export async function getProducts() {
	return getProductsPage();
}

export async function getProductsByCoupon({
	coupon,
	seller,
}: GetProductsByCouponOptions) {
	return getProductsPage({ coupon, seller });
}
