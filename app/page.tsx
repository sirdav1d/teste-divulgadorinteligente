/** @format */

import StorefrontClient from '@/components/storefront/storefront-client';
import { getCoupons, getProducts, getProductsByCoupon } from '@/lib/api/divulgador';
import { readSingleSearchParam } from '@/lib/storefront/search-params';

export default async function HomePage(props: PageProps<'/'>) {
	const resolvedSearchParams = await props.searchParams;
	const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
	const selectedCategory = readSingleSearchParam(resolvedSearchParams.category);
	const productsPromise = selectedCoupon
		? getProductsByCoupon({ coupon: selectedCoupon })
		: getProducts();
	const couponsPromise = getCoupons();
	const [products, coupons] = await Promise.all([productsPromise, couponsPromise]);

	return (
		<StorefrontClient
			products={products}
			coupons={coupons}
			selectedCategory={selectedCategory}
			selectedCoupon={selectedCoupon}
		/>
	);
}
