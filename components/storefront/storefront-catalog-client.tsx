/** @format */

'use client';

import { startTransition, useDeferredValue, useEffect, useState, useTransition } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
	ALL_CATEGORY_VALUE,
	buildCategoryOptions,
	filterProducts,
} from '@/lib/storefront/category-filters';
import { buildCouponOptions } from '@/lib/storefront/coupon-filters';
import type { Coupon, Product } from '@/lib/types/divulgador';

import CategoryFilter from '../catalog/category-filter';
import CouponFilter from '../catalog/coupon-filter';
import ProductGrid from '../catalog/product-grid';
import SearchBox from '../catalog/search-box';
import EmptyState from '../shared/empty-state';

type StorefrontCatalogClientProps = {
	products: readonly Product[];
	coupons: readonly Coupon[];
	onAddToCart: (product: Product) => void;
	selectedCategory: string | null;
	selectedCoupon: string | null;
};

const PAGE_SIZE = 12;

export default function StorefrontCatalogClient({
	products,
	coupons,
	onAddToCart,
	selectedCategory,
	selectedCoupon,
}: StorefrontCatalogClientProps) {
	const [isCouponPending, setIsCouponPending] = useState(false);
	const [isCategoryPending, startCategoryTransition] = useTransition();
	const pathname = usePathname();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const committedCategory = selectedCategory ?? ALL_CATEGORY_VALUE;
	const [selectedCategoryValue, setSelectedCategoryValue] = useState(committedCategory);
	const [visibleCount, setVisibleCount] = useState(() => PAGE_SIZE);
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const availableCategories = buildCategoryOptions(products);
	const availableCoupons = buildCouponOptions(coupons);
	const filteredProducts = filterProducts({
		products,
		searchQuery: deferredSearchQuery,
		selectedCategory: selectedCategoryValue,
	});
	const isFilterPending = isCouponPending || isCategoryPending;
	const visibleProducts = filteredProducts.slice(0, visibleCount);
	const hasMoreProducts = filteredProducts.length > visibleCount;

	useEffect(() => {
		setSelectedCategoryValue(committedCategory);
	}, [committedCategory]);

	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [committedCategory, selectedCoupon]);

	function handleSearchChange(value: string) {
		setSearchQuery(value);
		setVisibleCount(PAGE_SIZE);
	}

	function handleCategoryChange(value: string) {
		setSelectedCategoryValue(value);
		setVisibleCount(PAGE_SIZE);

		startCategoryTransition(() => {
			const searchParams = new URLSearchParams(window.location.search);

			if (value === ALL_CATEGORY_VALUE) {
				searchParams.delete('category');
			} else {
				searchParams.set('category', value);
			}

			const query = searchParams.toString();
			const href = query ? `${pathname}?${query}#catalogo` : `${pathname}#catalogo`;
			router.replace(href, { scroll: false });
		});
	}

	function handleLoadMore() {
		startTransition(() => {
			setVisibleCount((count) => count + PAGE_SIZE);
		});
	}

	return (
		<div className='relative mx-auto w-full max-w-368 px-4 py-4 sm:px-6 lg:px-8 xl:px-10'>
			<div className='sticky top-0 z-30 -mx-4 bg-background/40 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10'>
				<div
					id='catalogo'
					className='flex flex-col items-center gap-5 px-1 pt-1 sm:gap-6'>
					<div className='grid w-full max-w-6xl gap-3 lg:grid-cols-4 lg:items-stretch'>
						<SearchBox
							className='lg:col-span-2'
							value={searchQuery}
							onValueChange={handleSearchChange}
						/>
						<div className='lg:h-16'>
							<CouponFilter
								onPendingChange={setIsCouponPending}
								options={availableCoupons}
								selectedValue={selectedCoupon}
							/>
						</div>
						<div className='lg:h-16'>
							<CategoryFilter
								isPending={isCategoryPending}
								options={availableCategories}
								selectedValue={selectedCategoryValue}
								onValueChange={handleCategoryChange}
							/>
						</div>
					</div>
				</div>
			</div>

			<section className='mt-6 space-y-6 xl:mt-8 xl:space-y-8'>
				{filteredProducts.length > 0 ? (
					<ProductGrid
						isPending={isFilterPending}
						onAddToCart={onAddToCart}
						products={visibleProducts}
						totalCount={filteredProducts.length}
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
