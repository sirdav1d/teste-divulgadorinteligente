/** @format */

'use client';

import { startTransition, useDeferredValue, useState } from 'react';

import {
	ALL_CATEGORY_VALUE,
	buildCategoryOptions,
	filterProducts,
} from '@/lib/storefront/category-filters';
import type { Product } from '@/lib/types/divulgador';

import CategoryFilter from '../catalog/category-filter';
import ProductGrid from '../catalog/product-grid';
import SearchBox from '../catalog/search-box';
import EmptyState from '../shared/empty-state';

type StorefrontCatalogClientProps = {
	products: readonly Product[];
};

const PAGE_SIZE = 12;

export default function StorefrontCatalogClient({
	products,
}: StorefrontCatalogClientProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_VALUE);
	const [visibleCount, setVisibleCount] = useState(() => PAGE_SIZE);
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const availableCategories = buildCategoryOptions(products);
	const filteredProducts = filterProducts({
		products,
		searchQuery: deferredSearchQuery,
		selectedCategory,
	});
	const visibleProducts = filteredProducts.slice(0, visibleCount);
	const hasMoreProducts = filteredProducts.length > visibleCount;

	function resetVisibleCount() {
		startTransition(() => {
			setVisibleCount(PAGE_SIZE);
		});
	}

	function handleSearchChange(value: string) {
		setSearchQuery(value);
		resetVisibleCount();
	}

	function handleCategoryChange(value: string) {
		startTransition(() => {
			setSelectedCategory(value);
			setVisibleCount(PAGE_SIZE);
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
					<SearchBox
						value={searchQuery}
						onValueChange={handleSearchChange}
					/>
					<div className='w-full max-w-6xl'>
						<CategoryFilter
							options={availableCategories}
							selectedValue={selectedCategory}
							onValueChange={handleCategoryChange}
						/>
					</div>
				</div>
			</div>

			<section className='mt-6 space-y-6 xl:mt-8 xl:space-y-8'>
				{filteredProducts.length > 0 ? (
					<ProductGrid
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
