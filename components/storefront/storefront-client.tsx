"use client";

import { useDeferredValue, useState } from "react";

import {
  ALL_CATEGORY_VALUE,
  buildCategoryOptions,
  filterProducts,
} from "@/lib/storefront/category-filters";
import type { Product } from "@/lib/types/divulgador";

import CategoryFilter from "../catalog/category-filter";
import ProductGrid from "../catalog/product-grid";
import SearchBox from "../catalog/search-box";
import EmptyState from "../shared/empty-state";
import StorefrontHeader from "./storefront-header";

type StorefrontClientProps = {
  products: Product[];
  selectedCoupon: string | null;
};

const PAGE_SIZE = 12;

export default function StorefrontClient({
  products,
  selectedCoupon,
}: StorefrontClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_VALUE);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const availableCategories = buildCategoryOptions(products);
  const filteredProducts = filterProducts({
    products,
    searchQuery: deferredSearchQuery,
    selectedCategory,
  });
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-brand-accent-soft blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-accent-soft blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-col gap-6 lg:gap-8">
        <StorefrontHeader selectedCoupon={selectedCoupon} />

        <div
          id="catalogo"
          className="flex flex-col items-center gap-5 px-1 pt-1 sm:gap-6"
        >
          <SearchBox value={searchQuery} onValueChange={handleSearchChange} />
          <div className="w-full max-w-6xl">
            <CategoryFilter
              options={availableCategories}
              selectedValue={selectedCategory}
              onValueChange={handleCategoryChange}
            />
          </div>
        </div>

        <section className="space-y-6 xl:space-y-8">
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={visibleProducts}
              totalCount={filteredProducts.length}
              onLoadMore={
                hasMoreProducts
                  ? () => setVisibleCount((count) => count + PAGE_SIZE)
                  : undefined
              }
            />
          ) : (
            <EmptyState
              title="Nenhuma oferta combina com a busca atual."
              description="Tente outro termo, troque a categoria ativa ou volte ao estado inicial para revisar a amostra completa."
            />
          )}
        </section>
      </div>
    </main>
  );
}
