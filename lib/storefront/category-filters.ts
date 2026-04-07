import type { Product } from "../types/divulgador";

export const ALL_CATEGORY_VALUE = "all";
export const OTHER_CATEGORY_VALUE = "others";

export type CategoryOption = {
  value: string;
  label: string;
  count: number;
};

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function isOtherCategory(category: string | null) {
  return !category || !category.trim();
}

export function formatCategoryLabel(category: string) {
  return category
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getCategoryLabel(category: string | null) {
  const normalizedCategory = category?.trim();

  if (!normalizedCategory) {
    return "Outros";
  }

  return formatCategoryLabel(normalizedCategory);
}

export function buildCategoryOptions(
  products: readonly Product[],
): CategoryOption[] {
  const counts = new Map<string, number>();
  let otherCount = 0;

  for (const product of products) {
    const category = product.category?.trim();

    if (!category) {
      otherCount += 1;
      continue;
    }

    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const options = Array.from(counts.entries())
    .toSorted(([left], [right]) => left.localeCompare(right, "pt-BR"))
    .map(([value, count]) => ({
      value,
      label: formatCategoryLabel(value),
      count,
    }));

  return [
    {
      value: ALL_CATEGORY_VALUE,
      label: "Todos",
      count: products.length,
    },
    ...options,
    ...(otherCount > 0
      ? [
          {
            value: OTHER_CATEGORY_VALUE,
            label: "Outros",
            count: otherCount,
          },
        ]
      : []),
  ];
}

type FilterProductsOptions = {
  products: readonly Product[];
  searchQuery: string;
  selectedCategory: string;
};

export function filterProducts({
  products,
  searchQuery,
  selectedCategory,
}: FilterProductsOptions) {
  const normalizedQuery = normalizeText(searchQuery);

  return products.filter((product) => {
    const categoryMatches =
      selectedCategory === ALL_CATEGORY_VALUE
        ? true
        : selectedCategory === OTHER_CATEGORY_VALUE
          ? isOtherCategory(product.category)
          : product.category?.trim() === selectedCategory;

    if (!categoryMatches) {
      return false;
    }

    return normalizedQuery
      ? normalizeText(product.title).includes(normalizedQuery)
      : true;
  });
}
