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

export default function StorefrontClient({
  products,
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
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute left-0 top-20 h-56 w-56 rounded-full bg-brand-accent-soft blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-accent-soft blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-col gap-6 lg:gap-8">
        <StorefrontHeader selectedCoupon={selectedCoupon} />

        <section
          id="catalogo"
          className="rounded-[2rem] border border-border-soft bg-surface-glass px-5 py-5 shadow-[var(--shadow-soft)] backdrop-blur-md sm:px-6"
        >
          <SearchBox value={searchQuery} onValueChange={setSearchQuery} />
          <div className="mt-4">
            <CategoryFilter
              options={availableCategories}
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
            />
          </div>
        </section>

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
