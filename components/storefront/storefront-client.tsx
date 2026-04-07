/** @format */

import type { Coupon, Product } from '@/lib/types/divulgador';

import StorefrontExperience from './storefront-experience';

type StorefrontClientProps = {
	products: readonly Product[];
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
};

export default function StorefrontClient(props: StorefrontClientProps) {
	return <StorefrontExperience {...props} />;
}
