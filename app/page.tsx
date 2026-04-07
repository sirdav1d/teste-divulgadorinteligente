/** @format */

import StorefrontClient from '@/components/storefront/storefront-client';
import { getProducts, getProductsByCoupon } from '@/lib/api/divulgador';
import { readSingleSearchParam } from '@/lib/storefront/search-params';

export default async function HomePage(props: PageProps<'/'>) {
	const resolvedSearchParams = await props.searchParams;
	const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
	const products = selectedCoupon
		? await getProductsByCoupon({ coupon: selectedCoupon })
		: await getProducts();

	return (
		<StorefrontClient
			products={products}
			selectedCoupon={selectedCoupon}
		/>
	);
}
