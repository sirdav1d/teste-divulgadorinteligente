/** @format */

import { getCatalogPage } from '@/lib/divulgador';

function readQueryParam(
	searchParams: URLSearchParams,
	key: string,
): string | null {
	const value = searchParams.get(key)?.trim();

	return value ? value : null;
}

function readOffset(searchParams: URLSearchParams) {
	const value = searchParams.get('offset');

	if (!value) {
		return 0;
	}

	const parsedOffset = Number.parseInt(value, 10);

	return Number.isFinite(parsedOffset) && parsedOffset > 0 ? parsedOffset : 0;
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const catalogPage = await getCatalogPage({
		offset: readOffset(url.searchParams),
		coupon: readQueryParam(url.searchParams, 'coupon'),
		category: readQueryParam(url.searchParams, 'category'),
		search: readQueryParam(url.searchParams, 'search'),
	});

	return Response.json(catalogPage);
}
