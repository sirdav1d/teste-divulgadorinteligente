/** @format */

import { Suspense } from 'react';

import StorefrontInitialBootstrap from '@/components/storefront/storefront-initial-bootstrap';
import StorefrontExperience from '@/components/storefront/storefront-experience';

import { readSingleSearchParam } from '@/helpers/url/read-single-search-param';
import { getCatalogPage } from '@/lib/divulgador/catalog';
import { getCoupons } from '@/lib/divulgador/coupons';

type HomePageContentProps = {
	searchParamsPromise: PageProps<'/'>['searchParams'];
};

async function HomePageContent({
	searchParamsPromise,
}: HomePageContentProps) {
	const resolvedSearchParams = await searchParamsPromise;
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
		<StorefrontExperience
			catalogPage={catalogPage}
			coupons={coupons}
			selectedCategory={selectedCategory}
			selectedCoupon={selectedCoupon}
			selectedSearch={selectedSearch}
		/>
	);
}

export default function HomePage(props: PageProps<'/'>) {
	return (
		<>
			<StorefrontInitialBootstrap />
			<Suspense fallback={null}>
				<HomePageContent searchParamsPromise={props.searchParams} />
			</Suspense>
		</>
	);
}
