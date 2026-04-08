/** @format */

import { cacheLife, cacheTag } from 'next/cache';

import { SITE_NAME } from '@/constants/divulgador/api';
import {
	ALL_CATEGORY_VALUE,
	OTHER_CATEGORY_VALUE,
} from '@/constants/storefront/filters';
import {
	MAX_REMOTE_SCAN_PAGES,
	PAGE_SIZE,
} from '@/constants/storefront/pagination';
import {
	normalizeCoupon,
	normalizeProduct,
} from '@/helpers/divulgador/normalizers';
import { buildDivulgadorUrl } from '@/helpers/divulgador/build-url';
import {
	buildCategoryOptions,
	isOtherCategory,
} from '@/helpers/storefront/category-filters';
import type { CatalogPageOptions, CatalogPageResult } from '@/types/catalog';
import type {
	Coupon,
	DivulgadorCollectionResponse,
	DivulgadorCouponAttributes,
	DivulgadorProductAttributes,
	Product,
} from '@/types/divulgador';

async function fetchCollection<TAttributes>(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Divulgador API request failed with status ${response.status}`,
		);
	}

	return (await response.json()) as DivulgadorCollectionResponse<TAttributes>;
}

type FetchProductsPageOptions = {
	category?: string | null;
	coupon?: string | null;
	limit?: number;
	offset?: number;
	seller?: string;
};

function normalizeOffset(offset?: number) {
	return Number.isFinite(offset) && (offset ?? 0) > 0
		? Math.floor(offset as number)
		: 0;
}

function normalizeLimit(limit?: number) {
	return Number.isFinite(limit) && (limit ?? 0) > 0
		? Math.floor(limit as number)
		: PAGE_SIZE;
}

function normalizeSearchQuery(search?: string | null) {
	return search?.trim().toLocaleLowerCase('pt-BR') ?? '';
}

function shouldUseRemoteCategory(category?: string | null) {
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

function matchesSelectedCategory(
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

function matchesSearchQuery(product: Product, searchQuery: string) {
	if (!searchQuery) {
		return true;
	}

	return product.title.toLocaleLowerCase('pt-BR').includes(searchQuery);
}

async function getAvailableCategories(coupon?: string | null) {
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

export async function getProductsPage({
	category,
	coupon,
	limit = PAGE_SIZE,
	offset = 0,
	seller,
}: FetchProductsPageOptions = {}) {
	'use cache';

	cacheLife('minutes');
	cacheTag('products');

	const searchParams = new URLSearchParams({
		sitename: SITE_NAME,
		start: String(normalizeOffset(offset)),
		limit: String(normalizeLimit(limit)),
	});

	const remoteCategory = shouldUseRemoteCategory(category);

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

export async function getCatalogPage({
	category,
	coupon,
	offset = 0,
	pageSize = PAGE_SIZE,
	search,
}: CatalogPageOptions = {}): Promise<CatalogPageResult> {
	'use cache';

	cacheLife('minutes');
	cacheTag('products');

	const normalizedOffset = normalizeOffset(offset);
	const normalizedPageSize = normalizeLimit(pageSize);
	const normalizedSearchQuery = normalizeSearchQuery(search);
	const remoteScanBatchSize = PAGE_SIZE;
	const shouldScanRemotePages =
		Boolean(normalizedSearchQuery) || category?.trim() === OTHER_CATEGORY_VALUE;

	if (!shouldScanRemotePages) {
		const products = await getProductsPage({
			category,
			coupon,
			limit: normalizedPageSize,
			offset: normalizedOffset,
		});
		const availableCategories = await getAvailableCategories(coupon);

		return {
			availableCategories,
			products,
			hasMore: products.length === normalizedPageSize,
			nextOffset:
				products.length === normalizedPageSize
					? normalizedOffset + products.length
					: null,
		};
	}

	const matchedProducts: Product[] = [];
	let nextRemoteOffset = normalizedOffset;
	let pageNumber = 0;

	while (
		matchedProducts.length < normalizedPageSize &&
		pageNumber < MAX_REMOTE_SCAN_PAGES
	) {
		const products = await getProductsPage({
			category,
			coupon,
			limit: remoteScanBatchSize,
			offset: nextRemoteOffset,
		});

		if (products.length === 0) {
			const availableCategories = await getAvailableCategories(coupon);

			return {
				availableCategories,
				products: matchedProducts,
				hasMore: false,
				nextOffset: null,
			};
		}

		matchedProducts.push(
			...products.filter(
				(product) =>
					matchesSelectedCategory(product, category) &&
					matchesSearchQuery(product, normalizedSearchQuery),
			),
		);
		nextRemoteOffset += products.length;
		pageNumber += 1;

		if (products.length < remoteScanBatchSize) {
			const availableCategories = await getAvailableCategories(coupon);

			return {
				availableCategories,
				products: matchedProducts.slice(0, normalizedPageSize),
				hasMore: false,
				nextOffset: null,
			};
		}
	}

	const availableCategories = await getAvailableCategories(coupon);

	return {
		availableCategories,
		products: matchedProducts.slice(0, normalizedPageSize),
		hasMore: true,
		nextOffset: nextRemoteOffset,
	};
}

export async function getProducts() {
	return getProductsPage();
}

export async function getCoupons() {
	'use cache';

	cacheLife('minutes');
	cacheTag('coupons');

	const searchParams = new URLSearchParams({
		sitename: SITE_NAME,
		start: '0',
		limit: '10',
		featured: 'false',
	});

	const payload = await fetchCollection<DivulgadorCouponAttributes>(
		buildDivulgadorUrl('/coupons/public', searchParams),
	);

	return payload.data.map(normalizeCoupon);
}

type GetProductsByCouponOptions = {
	coupon: string;
	seller?: string;
};

export async function getProductsByCoupon({
	coupon,
	seller,
}: GetProductsByCouponOptions) {
	return getProductsPage({ coupon, seller });
}

export type { Coupon, Product };
