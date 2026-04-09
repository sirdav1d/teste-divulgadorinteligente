/** @format */

import { afterEach, describe, expect, it, vi } from 'vitest';

const { getCatalogPageMock } = vi.hoisted(() => ({
	getCatalogPageMock: vi.fn(),
}));

vi.mock('../../lib/divulgador/catalog', () => ({
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
			includeCategories: true,
		});
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			products: [],
			hasMore: true,
			nextOffset: 40,
			availableCategories: [],
		});
	});

	it('normalizes blank optional query params to null before calling the catalog layer', async () => {
		getCatalogPageMock.mockResolvedValue({
			products: [],
			hasMore: false,
			nextOffset: null,
			availableCategories: [],
		});

		await GET(
			new Request(
				'http://localhost/api/catalog?offset=0&coupon=&category=&search=%20%20',
			),
		);

		expect(getCatalogPageMock).toHaveBeenCalledWith({
			offset: 0,
			coupon: null,
			category: null,
			search: null,
			includeCategories: true,
		});
	});

	it('allows append requests to skip category hydration', async () => {
		getCatalogPageMock.mockResolvedValue({
			products: [],
			hasMore: true,
			nextOffset: 60,
		});

		await GET(
			new Request(
				'http://localhost/api/catalog?offset=40&includeCategories=0&coupon=AGORAVAI',
			),
		);

		expect(getCatalogPageMock).toHaveBeenCalledWith({
			offset: 40,
			coupon: 'AGORAVAI',
			category: null,
			search: null,
			includeCategories: false,
		});
	});

	it('rejects malformed offsets with a 400 response instead of coercing them', async () => {
		const response = await GET(
			new Request('http://localhost/api/catalog?offset=abc'),
		);

		expect(getCatalogPageMock).not.toHaveBeenCalled();
		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: {
				code: 'INVALID_QUERY',
				message: 'Invalid catalog query parameters.',
				details: ['offset must be a non-negative integer.'],
			},
		});
	});

	it('rejects duplicate query params that would make the request ambiguous', async () => {
		const response = await GET(
			new Request(
				'http://localhost/api/catalog?coupon=AGORAVAI&coupon=SEUCUPOM',
			),
		);

		expect(getCatalogPageMock).not.toHaveBeenCalled();
		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: {
				code: 'INVALID_QUERY',
				message: 'Invalid catalog query parameters.',
				details: ['coupon must appear at most once.'],
			},
		});
	});

	it('rejects unsupported includeCategories values with a 400 response', async () => {
		const response = await GET(
			new Request('http://localhost/api/catalog?includeCategories=2'),
		);

		expect(getCatalogPageMock).not.toHaveBeenCalled();
		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: {
				code: 'INVALID_QUERY',
				message: 'Invalid catalog query parameters.',
				details: ['includeCategories must be "0" or "1" when provided.'],
			},
		});
	});

	it('returns a stable 502 payload when the catalog layer fails', async () => {
		getCatalogPageMock.mockRejectedValue(new Error('upstream exploded'));

		const response = await GET(new Request('http://localhost/api/catalog'));

		expect(response.status).toBe(502);
		await expect(response.json()).resolves.toEqual({
			error: {
				code: 'CATALOG_UNAVAILABLE',
				message: 'Unable to load catalog data.',
			},
		});
	});
});
