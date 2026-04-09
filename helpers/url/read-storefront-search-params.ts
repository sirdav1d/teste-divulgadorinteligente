/** @format */

import { readSingleSearchParam } from './read-single-search-param';

type StorefrontSearchParamValue = string | string[] | undefined;

type StorefrontSearchParams = {
	category?: StorefrontSearchParamValue;
	coupon?: StorefrontSearchParamValue;
	search?: StorefrontSearchParamValue;
};

export function readStorefrontSearchParams(
	searchParams: StorefrontSearchParams,
) {
	return {
		selectedCategory: readSingleSearchParam(searchParams.category),
		selectedCoupon: readSingleSearchParam(searchParams.coupon),
		selectedSearch: readSingleSearchParam(searchParams.search),
	};
}
