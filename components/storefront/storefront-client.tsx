/** @format */

import type { Product } from '@/lib/types/divulgador';

import StorefrontFooter from './storefront-footer';
import StorefrontCatalogClient from './storefront-catalog-client';
import StorefrontHeader from './storefront-header';

type StorefrontClientProps = {
	products: readonly Product[];
	selectedCoupon: string | null;
};

export default function StorefrontClient({
	products,
	selectedCoupon,
}: StorefrontClientProps) {
	return (
		<main className='relative min-h-screen'>
			<div className='pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-brand-accent-soft blur-3xl' />
			<div className='pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-accent-soft blur-3xl' />

			<StorefrontHeader selectedCoupon={selectedCoupon} />
			<StorefrontCatalogClient products={products} />

			<StorefrontFooter />
		</main>
	);
}
