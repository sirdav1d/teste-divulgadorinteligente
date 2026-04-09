/** @format */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({
	cacheLife: vi.fn(),
	cacheTag: vi.fn(),
}));

import { cacheTag } from 'next/cache';

import {
	getCatalogPage,
	getCoupons,
	getProducts,
	getProductsByCoupon,
} from '../../lib/divulgador';
import {
	normalizeCoupon,
	normalizeProduct,
} from '../../helpers/divulgador/normalizers';
import { parseCurrencyValue } from '../../helpers/currency/parse-currency-value';
import type { DivulgadorProductAttributes } from '../../types/divulgador';

const productFixture = {
	id: 37091563,
	attributes: {
		title: 'Panela Elétrica Electrolux vapor arroz capacidade 1,8L 10 xícaras',
		image: 'https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg',
		price_from: null,
		price: 'R$\u00a0269,82',
		link: 'https://amzn.to/4bUfKQm',
		seller: 'amazon',
		highlight: false,
		free_shipping: false,
		coupon: 'SEUCUPOM',
		installment: 'ou 6x de R$\u00a045,00',
		category: 'kitchen',
	},
};

const couponFixture = {
	id: 955361,
	attributes: {
		seller: 'amazon',
		code: 'SEUCUPOM',
		discount: '10',
		title: 'Cupom Amazon',
		description: 'Desconto exclusivo: ative seu cupom e aproveite a oferta!',
		featured: false,
		discount_type: 'percent',
	},
};

function createProductFixture(
	id: number,
	overrides: Partial<DivulgadorProductAttributes> = {},
) {
	return {
		id,
		attributes: {
			...productFixture.attributes,
			title: `Produto ${id}`,
			link: `https://example.com/products/${id}`,
			...overrides,
		},
	};
}

describe('divulgador data layer', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it('parses Brazilian currency strings into numeric values', () => {
		expect(parseCurrencyValue('R$\u00a0269,82')).toBe(269.82);
		expect(parseCurrencyValue('R$ 199,99')).toBe(199.99);
		expect(parseCurrencyValue(null)).toBeNull();
	});

	it('normalizes raw product payloads into a serializable storefront shape', () => {
		expect(normalizeProduct(productFixture)).toEqual({
			id: '37091563',
			title:
				'Panela Elétrica Electrolux vapor arroz capacidade 1,8L 10 xícaras',
			imageUrl:
				'https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg',
			priceLabel: 'R$\u00a0269,82',
			priceValue: 269.82,
			priceFromLabel: null,
			link: 'https://amzn.to/4bUfKQm',
			seller: 'amazon',
			couponCode: 'SEUCUPOM',
			installment: 'ou 6x de R$\u00a045,00',
			highlight: false,
			freeShipping: false,
			category: 'kitchen',
		});
	});

	it('normalizes raw coupon payloads into a serializable coupon shape', () => {
		expect(normalizeCoupon(couponFixture)).toEqual({
			id: '955361',
			seller: 'amazon',
			code: 'SEUCUPOM',
			title: 'Cupom Amazon',
			description: 'Desconto exclusivo: ative seu cupom e aproveite a oferta!',
			featured: false,
			discountType: 'percent',
			discountValue: 10,
			discountLabel: '10%',
		});
	});

	it('fetches and normalizes products by coupon with the expected query params', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => ({ data: [productFixture] }),
		});

		const products = await getProductsByCoupon({
			coupon: 'AGORAVAI',
			seller: 'magalu',
		});

		expect(products).toHaveLength(1);
		expect(products[0].couponCode).toBe('SEUCUPOM');

		const [requestUrl] = fetchMock.mock.calls[0] as [string];
		const url = new URL(requestUrl);

		expect(url.pathname).toBe('/api/products');
		expect(url.searchParams.get('coupon')).toBe('AGORAVAI');
		expect(url.searchParams.get('sitename')).toBe('espionandopromos');
		expect(url.searchParams.get('limit')).toBe('20');
		expect(url.searchParams.getAll('sellers[]')).toEqual(['magalu']);
	});

	it('returns a remote catalog page with the requested offset and metadata', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: Array.from({ length: 20 }, (_, index) =>
						createProductFixture(index + 41, {
							category: 'kitchen',
						}),
					),
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: Array.from({ length: 20 }, (_, index) =>
						createProductFixture(index + 1, {
							category: 'kitchen',
						}),
					),
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ data: [] }),
			});

		const page = await getCatalogPage({
			offset: 40,
			pageSize: 20,
			category: 'kitchen',
		});

		expect(page.products).toHaveLength(20);
		expect(page.hasMore).toBe(true);
		expect(page.nextOffset).toBe(60);
		expect(page.availableCategories).toEqual([
			{
				value: 'all',
				label: 'Todos',
				count: 20,
			},
			{
				value: 'kitchen',
				label: 'Kitchen',
				count: 20,
			},
		]);

		const [requestUrl] = fetchMock.mock.calls[0] as [string];
		const url = new URL(requestUrl);

		expect(url.searchParams.get('start')).toBe('40');
		expect(url.searchParams.get('limit')).toBe('20');
		expect(url.searchParams.get('category')).toBe('kitchen');
	});

	it('skips category aggregation work when the caller only needs the next page', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => ({
				data: Array.from({ length: 20 }, (_, index) =>
					createProductFixture(index + 21, {
						category: 'kitchen',
					}),
				),
			}),
		});

		const page = await getCatalogPage({
			offset: 20,
			pageSize: 20,
			category: 'kitchen',
			includeCategories: false,
		});

		expect(page.products).toHaveLength(20);
		expect(page.hasMore).toBe(true);
		expect(page.nextOffset).toBe(40);
		expect(page.availableCategories).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps scanning remote pages until search finds matching products', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: Array.from({ length: 20 }, (_, index) =>
						createProductFixture(index + 1, {
							title: `Oferta ${index + 1}`,
							category: 'kitchen',
						}),
					),
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(21, {
							title: 'Mesa lateral para sala',
							category: 'office',
						}),
					],
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: Array.from({ length: 20 }, (_, index) =>
						createProductFixture(index + 1, {
							title: `Oferta ${index + 1}`,
							category: 'kitchen',
						}),
					),
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(21, {
							title: 'Mesa lateral para sala',
							category: 'office',
						}),
					],
				}),
			});

		const page = await getCatalogPage({
			search: 'mesa',
			pageSize: 1,
		});

		expect(page.products).toHaveLength(1);
		expect(page.products[0]?.title).toBe('Mesa lateral para sala');
		expect(page.hasMore).toBe(false);
		expect(page.nextOffset).toBeNull();
		expect(page.availableCategories).toEqual([
			{
				value: 'all',
				label: 'Todos',
				count: 21,
			},
			{
				value: 'kitchen',
				label: 'Kitchen',
				count: 20,
			},
			{
				value: 'office',
				label: 'Office',
				count: 1,
			},
		]);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		const firstUrl = new URL(fetchMock.mock.calls[0]![0] as string);
		const secondUrl = new URL(fetchMock.mock.calls[1]![0] as string);

		expect(firstUrl.searchParams.get('start')).toBe('0');
		expect(secondUrl.searchParams.get('start')).toBe('20');
	});

	it('builds category options for the full remote catalog filtered only by coupon', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(1, {
							title: 'Oferta cozinha 1',
							category: 'kitchen',
							coupon: 'AGORAVAI',
						}),
						createProductFixture(2, {
							title: 'Oferta office 1',
							category: 'office',
							coupon: 'AGORAVAI',
						}),
						createProductFixture(3, {
							title: 'Oferta office 2',
							category: 'office',
							coupon: 'AGORAVAI',
						}),
					],
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(1, {
							title: 'Oferta cozinha 1',
							category: 'kitchen',
							coupon: 'AGORAVAI',
						}),
						createProductFixture(2, {
							title: 'Oferta office 1',
							category: 'office',
							coupon: 'AGORAVAI',
						}),
						createProductFixture(3, {
							title: 'Oferta office 2',
							category: 'office',
							coupon: 'AGORAVAI',
						}),
					],
				}),
			});

		const page = await getCatalogPage({
			coupon: 'AGORAVAI',
			search: 'cozinha',
			pageSize: 1,
		});

		expect(page.products).toHaveLength(1);
		expect(page.availableCategories).toEqual([
			{
				value: 'all',
				label: 'Todos',
				count: 3,
			},
			{
				value: 'kitchen',
				label: 'Kitchen',
				count: 1,
			},
			{
				value: 'office',
				label: 'Office',
				count: 2,
			},
		]);

		expect(fetchMock).toHaveBeenCalledTimes(1);

		const firstUrl = new URL(fetchMock.mock.calls[0]![0] as string);

		expect(firstUrl.searchParams.get('coupon')).toBe('AGORAVAI');
		expect(firstUrl.searchParams.get('start')).toBe('0');
		expect(firstUrl.searchParams.get('search')).toBeNull();
	});

	it('reuses the same remote scan to serve the others category and category options', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: Array.from({ length: 20 }, (_, index) =>
						createProductFixture(index + 1, {
							title: `Oferta ${index + 1}`,
							category: 'kitchen',
						}),
					),
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(21, {
							title: 'Oferta sem categoria',
							category: null,
						}),
					],
				}),
			});

		const page = await getCatalogPage({
			category: 'others',
			pageSize: 1,
		});

		expect(page.products).toHaveLength(1);
		expect(page.products[0]?.title).toBe('Oferta sem categoria');
		expect(page.availableCategories).toEqual([
			{
				value: 'all',
				label: 'Todos',
				count: 21,
			},
			{
				value: 'kitchen',
				label: 'Kitchen',
				count: 20,
			},
			{
				value: 'others',
				label: 'Outros',
				count: 1,
			},
		]);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		const firstUrl = new URL(fetchMock.mock.calls[0]![0] as string);
		const secondUrl = new URL(fetchMock.mock.calls[1]![0] as string);

		expect(firstUrl.searchParams.get('category')).toBeNull();
		expect(secondUrl.searchParams.get('category')).toBeNull();
		expect(firstUrl.searchParams.get('start')).toBe('0');
		expect(secondUrl.searchParams.get('start')).toBe('20');
	});

	it('applies granular cache tags to catalog pages and category aggregation', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(1, {
							title: 'Oferta cozinha 1',
							category: 'kitchen',
							coupon: 'AGORAVAI',
						}),
					],
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						createProductFixture(1, {
							title: 'Oferta cozinha 1',
							category: 'kitchen',
							coupon: 'AGORAVAI',
						}),
					],
				}),
			});

		await getCatalogPage({
			coupon: 'AGORAVAI',
			search: 'cozinha',
			pageSize: 1,
		});

		const appliedTags = vi.mocked(cacheTag).mock.calls.flat();

		expect(appliedTags).toContain('catalog-page');
		expect(appliedTags).toContain('catalog-page:coupon:AGORAVAI');
		expect(appliedTags).toContain('catalog-page:search');
		expect(appliedTags).toContain('catalog-products');
		expect(appliedTags).toContain('catalog-products:coupon:AGORAVAI');
		expect(appliedTags).not.toContain('catalog-categories');
		expect(appliedTags).not.toContain('catalog-categories:coupon:AGORAVAI');
	});

	it('applies resource-specific cache tags to coupon reads', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => ({ data: [couponFixture] }),
		});

		await getCoupons();

		const appliedTags = vi.mocked(cacheTag).mock.calls.flat();

		expect(appliedTags).toContain('catalog-coupons');
		expect(appliedTags).not.toContain('coupons');
	});

	it('fetches products and coupons from the public endpoints', async () => {
		fetchMock
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ data: [productFixture] }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ data: [couponFixture] }),
			});

		const [products, coupons] = await Promise.all([
			getProducts(),
			getCoupons(),
		]);

		expect(products[0].title).toContain('Panela Elétrica');
		expect(coupons[0].code).toBe('SEUCUPOM');
	});
});
