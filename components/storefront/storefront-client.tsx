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
  couponCount: number;
  selectedCoupon: string | null;
};

export default function StorefrontClient({
  products,
  couponCount,
  selectedCoupon,
}: StorefrontClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_VALUE);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const availableCategories = buildCategoryOptions(products);
  const visibleProducts = filterProducts({
    products,
    searchQuery: deferredSearchQuery,
    selectedCategory,
  });

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
      <div className="pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-52 w-52 rounded-full bg-[var(--sage-soft)] blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-col gap-8 lg:gap-10">
        <StorefrontHeader
          totalProducts={products.length}
          couponCount={couponCount}
          selectedCoupon={selectedCoupon}
        />

        <SearchBox value={searchQuery} onValueChange={setSearchQuery} />

        <CategoryFilter
          options={availableCategories}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />

        <section className="space-y-6 xl:space-y-8">
          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} />
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
