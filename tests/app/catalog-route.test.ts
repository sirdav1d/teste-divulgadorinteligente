/** @format */

import { afterEach, describe, expect, it, vi } from 'vitest';

const { getCatalogPageMock } = vi.hoisted(() => ({
	getCatalogPageMock: vi.fn(),
}));

vi.mock('../../lib/divulgador', () => ({
	getCatalogPage: getCatalogPageMock,
}));

import { GET } from '../../app/api/catalog/route';

describe('catalog route', () => {
	afterEach(() => {
		getCatalogPageMock.mockReset();
	});

	it('forwards catalog filters and offset to the paginated catalog layer', async () => {
		getCatalogPageMock.mockResolvedValue({
			products: [],
			hasMore: true,
			nextOffset: 40,
			availableCategories: [],
		});

		const response = await GET(
			new Request(
				'http://localhost/api/catalog?offset=20&coupon=AGORAVAI&category=kitchen&search=mesa',
			),
		);

		expect(getCatalogPageMock).toHaveBeenCalledWith({
			offset: 20,
			coupon: 'AGORAVAI',
			category: 'kitchen',
			search: 'mesa',
		});
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			products: [],
			hasMore: true,
			nextOffset: 40,
			availableCategories: [],
		});
	});

	it('falls back to offset zero when the query param is invalid', async () => {
		getCatalogPageMock.mockResolvedValue({
			products: [],
			hasMore: false,
			nextOffset: null,
			availableCategories: [],
		});

		await GET(
			new Request(
				'http://localhost/api/catalog?offset=abc&coupon=&category=&search=%20%20',
			),
		);

		expect(getCatalogPageMock).toHaveBeenCalledWith({
			offset: 0,
			coupon: null,
			category: null,
			search: null,
		});
	});
});
