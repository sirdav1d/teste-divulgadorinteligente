import { describe, expect, it } from "vitest";

import {
  ALL_CATEGORY_VALUE,
  OTHER_CATEGORY_VALUE,
  buildCategoryOptions,
  filterProducts,
} from "../../../lib/storefront/category-filters";
import type { Product } from "../../../lib/types/divulgador";

const products: Product[] = [
  {
    id: "1",
    title: "Panela de arroz",
    imageUrl: null,
    priceLabel: null,
    priceValue: null,
    priceFromLabel: null,
    link: "#",
    seller: "amazon",
    couponCode: null,
    installment: null,
    highlight: false,
    freeShipping: false,
    category: "kitchen",
  },
  {
    id: "2",
    title: "Kit academia",
    imageUrl: null,
    priceLabel: null,
    priceValue: null,
    priceFromLabel: null,
    link: "#",
    seller: "mercadolivre",
    couponCode: null,
    installment: null,
    highlight: false,
    freeShipping: false,
    category: null,
  },
];

describe("category-filters", () => {
  it("builds Todos plus real categories and Outros", () => {
    expect(buildCategoryOptions(products)).toEqual([
      { value: ALL_CATEGORY_VALUE, label: "Todos", count: 2 },
      { value: "kitchen", label: "Kitchen", count: 1 },
      { value: OTHER_CATEGORY_VALUE, label: "Outros", count: 1 },
    ]);
  });

  it("filters by category and text together", () => {
    expect(
      filterProducts({
        products,
        searchQuery: "kit",
        selectedCategory: OTHER_CATEGORY_VALUE,
      }),
    ).toHaveLength(1);
  });
});
