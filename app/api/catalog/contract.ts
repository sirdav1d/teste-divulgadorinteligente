/** @format */

import type {
	CatalogRouteErrorResponse,
	CatalogRouteRequest,
} from '@/types/catalog';

const SINGLE_VALUE_QUERY_KEYS = [
	'offset',
	'coupon',
	'category',
	'search',
	'includeCategories',
] as const;

type CatalogQueryKey = (typeof SINGLE_VALUE_QUERY_KEYS)[number];

class CatalogRouteValidationError extends Error {
	readonly details: string[];

	constructor(details: string[]) {
		super('Invalid catalog query parameters.');
		this.details = details;
	}
}

function readSingleValue(
	searchParams: URLSearchParams,
	key: CatalogQueryKey,
	details: string[],
) {
	const values = searchParams.getAll(key);

	if (values.length > 1) {
		details.push(`${key} must appear at most once.`);
		return null;
	}

	return values[0] ?? null;
}

function normalizeOptionalQueryParam(value: string | null) {
	const normalizedValue = value?.trim();

	return normalizedValue ? normalizedValue : null;
}

function parseOffset(value: string | null, details: string[]) {
	if (value === null) {
		return 0;
	}

	if (!/^(0|[1-9]\d*)$/.test(value)) {
		details.push('offset must be a non-negative integer.');
		return 0;
	}

	return Number.parseInt(value, 10);
}

function parseIncludeCategories(value: string | null, details: string[]) {
	if (value === null || value === '1') {
		return true;
	}

	if (value === '0') {
		return false;
	}

	details.push('includeCategories must be "0" or "1" when provided.');
	return true;
}

export function parseCatalogRouteRequest(
	searchParams: URLSearchParams,
): CatalogRouteRequest {
	const details: string[] = [];
	const rawValues = Object.fromEntries(
		SINGLE_VALUE_QUERY_KEYS.map((key) => [
			key,
			readSingleValue(searchParams, key, details),
		]),
	) as Record<CatalogQueryKey, string | null>;
	const request: CatalogRouteRequest = {
		offset: parseOffset(rawValues.offset, details),
		coupon: normalizeOptionalQueryParam(rawValues.coupon),
		category: normalizeOptionalQueryParam(rawValues.category),
		search: normalizeOptionalQueryParam(rawValues.search),
		includeCategories: parseIncludeCategories(
			rawValues.includeCategories,
			details,
		),
	};

	if (details.length > 0) {
		throw new CatalogRouteValidationError(details);
	}

	return request;
}

export function createCatalogRouteValidationResponse(details: string[]) {
	return Response.json(
		{
			error: {
				code: 'INVALID_QUERY',
				message: 'Invalid catalog query parameters.',
				details,
			},
		} satisfies CatalogRouteErrorResponse,
		{ status: 400 },
	);
}

export function createCatalogRouteUnavailableResponse() {
	return Response.json(
		{
			error: {
				code: 'CATALOG_UNAVAILABLE',
				message: 'Unable to load catalog data.',
			},
		} satisfies CatalogRouteErrorResponse,
		{ status: 502 },
	);
}

export function isCatalogRouteValidationError(
	error: unknown,
): error is CatalogRouteValidationError {
	return error instanceof CatalogRouteValidationError;
}
