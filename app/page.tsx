/** @format */

import StorefrontClient from '@/components/storefront/storefront-client';
import { getCatalogPage, getCoupons } from '@/lib/divulgador';
import { readSingleSearchParam } from '@/helpers/url/read-single-search-param';

export default async function HomePage(props: PageProps<'/'>) {
	const resolvedSearchParams = await props.searchParams;
	const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
	const selectedCategory = readSingleSearchParam(resolvedSearchParams.category);
	const selectedSearch = readSingleSearchParam(resolvedSearchParams.search);
	const catalogPagePromise = getCatalogPage({
		category: selectedCategory,
		coupon: selectedCoupon,
		search: selectedSearch,
	});
	const couponsPromise = getCoupons();
	const [catalogPage, coupons] = await Promise.all([
		catalogPagePromise,
		couponsPromise,
	]);

	return (
		<StorefrontClient
			catalogPage={catalogPage}
			coupons={coupons}
			selectedCategory={selectedCategory}
			selectedCoupon={selectedCoupon}
			selectedSearch={selectedSearch}
		/>
	);
}
