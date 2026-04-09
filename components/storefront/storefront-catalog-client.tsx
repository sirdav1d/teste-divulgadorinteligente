/** @format */

'use client';

import type { CatalogPageResult } from '@/types/catalog';
import type { Coupon } from '@/types/divulgador';
import { useCart } from '@/hooks/storefront/use-cart';
import { useStorefrontCatalog } from '@/hooks/storefront/use-storefront-catalog';

import CategoryFilter from '../catalog/category-filter';
import CouponFilter from '../catalog/coupon-filter';
import ProductGrid from '../catalog/product-grid';
import SearchBox from '../catalog/search-box';
import EmptyState from '../shared/empty-state';

type StorefrontCatalogClientProps = {
	initialCatalogPage: CatalogPageResult;
	coupons: readonly Coupon[];
	selectedCategory: string | null;
	selectedCoupon: string | null;
	selectedSearch: string | null;
};

export default function StorefrontCatalogClient({
	initialCatalogPage,
	coupons,
	selectedCategory,
	selectedCoupon,
	selectedSearch,
}: StorefrontCatalogClientProps) {
	const { cartQuantities, incrementCart, decrementCart } = useCart();
	const {
		catalogError,
		searchQuery,
		selectedCategoryValue,
		selectedCouponValue,
		loadedProducts,
		hasMoreProducts,
		isRefreshingCatalog,
		isLoadingMore,
		availableCategories,
		availableCoupons,
		shouldShowGrid,
		setSearchQuery,
		setSelectedCategoryValue,
		setSelectedCouponValue,
		handleLoadMore,
	} = useStorefrontCatalog({
		initialCatalogPage,
		coupons,
		selectedCategory,
		selectedCoupon,
		selectedSearch,
	});

	return (
		<div className='relative mx-auto w-full max-w-368 px-4 py-4 sm:px-6 lg:px-8 xl:px-10'>
			<div className='sticky top-0 z-30 -mx-4 bg-background/40 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10'>
				<div
					id='catalogo'
					className='flex flex-col items-center gap-5 px-1 pt-1 sm:gap-6'>
					<div className='grid w-full gap-3 lg:grid-cols-4 lg:items-stretch'>
						<SearchBox
							className='lg:col-span-2'
							value={searchQuery}
							onValueChange={setSearchQuery}
						/>
						<div className='lg:h-16'>
							<CouponFilter
								isPending={isRefreshingCatalog}
								options={availableCoupons}
								selectedValue={selectedCouponValue}
								onValueChange={setSelectedCouponValue}
							/>
						</div>
						<div className='lg:h-16'>
							<CategoryFilter
								isPending={isRefreshingCatalog}
								options={availableCategories}
								selectedValue={selectedCategoryValue}
								onValueChange={setSelectedCategoryValue}
							/>
						</div>
					</div>
				</div>
			</div>

			<section className='mt-6 space-y-6 xl:mt-8 xl:space-y-8'>
				{catalogError ? (
					<p
						role='alert'
						className='rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive'>
						{catalogError}
					</p>
				) : null}
				{shouldShowGrid ? (
					<ProductGrid
						cartQuantities={cartQuantities}
						hasMoreProducts={hasMoreProducts}
						isPending={isRefreshingCatalog}
						isLoadingMore={isLoadingMore}
						onIncrement={incrementCart}
						onDecrement={decrementCart}
						products={loadedProducts}
						onLoadMore={hasMoreProducts ? handleLoadMore : undefined}
					/>
				) : (
					<EmptyState
						title='Nenhuma oferta combina com a busca atual.'
						description='Tente outro termo, troque a categoria ativa ou volte ao estado inicial para revisar a amostra completa.'
					/>
				)}
			</section>
		</div>
	);
}
