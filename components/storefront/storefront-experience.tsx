/** @format */

import type { CatalogPageResult } from '@/types/catalog';
import type { Coupon } from '@/types/divulgador';

import StorefrontCatalogClient from './storefront-catalog-client';
import StorefrontFooter from './storefront-footer';
import StorefrontHeader from './storefront-header';
import StorefrontHeroClient from './storefront-hero-client';

type StorefrontExperienceProps = {
	catalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

export default function StorefrontExperience({
	catalogPage,
	coupons,
	selectedCategory,
	selectedCoupon,
	selectedSearch,
}: StorefrontExperienceProps) {
	const heroId = 'storefront-hero';

	return (
		<main
			data-home-bootstrap-root='true'
			className='relative min-h-screen'>
			<div className='pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-brand-accent-soft blur-3xl' />
			<div className='pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-accent-soft blur-3xl' />

			<StorefrontHeroClient targetId={heroId}>
				<StorefrontHeader heroId={heroId} />
			</StorefrontHeroClient>

			<StorefrontCatalogClient
				initialCatalogPage={catalogPage}
				coupons={coupons}
				selectedCategory={selectedCategory}
				selectedCoupon={selectedCoupon}
				selectedSearch={selectedSearch}
			/>

			<StorefrontFooter />
		</main>
	);
}
