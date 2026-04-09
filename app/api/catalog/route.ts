/** @format */

import { getCatalogPage } from '@/lib/divulgador/catalog';
import {
	createCatalogRouteUnavailableResponse,
	createCatalogRouteValidationResponse,
	isCatalogRouteValidationError,
	parseCatalogRouteRequest,
} from '@/lib/divulgador/catalog-route';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const catalogPage = await getCatalogPage(
			parseCatalogRouteRequest(url.searchParams),
		);

		return Response.json(catalogPage);
	} catch (error) {
		if (isCatalogRouteValidationError(error)) {
			return createCatalogRouteValidationResponse(error.details);
		}

		return createCatalogRouteUnavailableResponse();
	}
}
