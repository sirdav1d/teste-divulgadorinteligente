/** @format */

import type { CatalogPageResult } from '@/types/catalog';
import type { Coupon } from '@/types/divulgador';

import StorefrontExperience from './storefront-experience';

type StorefrontClientProps = {
	catalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

export default function StorefrontClient(props: StorefrontClientProps) {
	return <StorefrontExperience {...props} />;
}
