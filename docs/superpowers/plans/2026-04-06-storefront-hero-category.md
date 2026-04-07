# Storefront Hero Category Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the storefront into a `100vh` hero followed by a full-width search bar, a dynamic category rail, and a product grid filtered by text plus category.

**Architecture:** Keep `app/page.tsx` server-first and preserve the current API layer. Move the new filter domain into a pure helper module under `lib/storefront/`, keep `StorefrontClient` as the single client coordinator for `searchQuery` and `selectedCategory`, and add one dedicated presentational component for the dynamic category rail. Keep all filtering derived during render; no duplicated state in `useEffect`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, React DOM test renderer, `next/image`

---

## File Structure

- Create: `lib/storefront/category-filters.ts`
  - Pure storefront helpers for category normalization, category option derivation, and combined search/category filtering.
- Create: `components/catalog/category-filter.tsx`
  - Small client-safe presentational component that renders the category rail and emits selection changes.
- Create: `tests/lib/storefront/category-filters.test.ts`
  - Unit coverage for `Todos`, dynamic categories, `Outros`, and combined filtering.
- Modify: `tests/components/storefront-client.test.tsx`
  - Integration coverage for layout order, dynamic category buttons, `Outros`, and text + category interaction.
- Modify: `tests/components/product-card.test.tsx`
  - Keep the product card copy aligned if uncategorized items should display `Outros`.
- Modify: `components/storefront/storefront-client.tsx`
  - Own `searchQuery` plus `selectedCategory`, derive `availableCategories` and `visibleProducts`, and reorder the page blocks to `hero -> search -> categories -> products`.
- Modify: `components/storefront/storefront-header.tsx`
  - Convert the header into a full-height hero without the current stats sidebar.
- Modify: `components/catalog/search-box.tsx`
  - Refactor the search module into a full-width horizontal exploration control.
- Modify: `components/catalog/product-grid.tsx`
  - Adjust spacing and section wrapper to sit below the category rail cleanly.
- Modify: `components/catalog/product-card.tsx`
  - Align the category chip language for uncategorized items with the new `Outros` grouping.
- Modify: `app/globals.css`
  - Tune layout tokens and viewport handling for the new hero rhythm and category rail wrapping.

## Implementation Notes

- Use `@test-driven-development` for each behavior change before implementation.
- Use `@frontend-design` for the hero/search/category visual refactor so the new hierarchy feels intentional, not generic.
- Use `@next-best-practices` and `@vercel-react-best-practices` when touching `StorefrontClient`: keep the client boundary tight and keep `visibleProducts`/`availableCategories` derived in render.
- If any test fails for reasons other than the intended expectation, switch to `@systematic-debugging` before patching more code.
- Finish with `@verification-before-completion` before claiming the redesign is done.

## Chunk 1: Filter Domain

### Task 1: Add failing unit tests for category derivation and combined filtering

**Files:**
- Create: `tests/lib/storefront/category-filters.test.ts`
- Reference: `lib/types/divulgador.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";

import {
  ALL_CATEGORY_VALUE,
  OTHER_CATEGORY_VALUE,
  buildCategoryOptions,
  filterProducts,
} from "../../lib/storefront/category-filters";
import type { Product } from "../../lib/types/divulgador";

const products: Product[] = [
  { id: "1", title: "Panela de arroz", category: "kitchen", imageUrl: null, priceLabel: null, priceValue: null, priceFromLabel: null, link: "#", seller: "amazon", couponCode: null, installment: null, highlight: false, freeShipping: false },
  { id: "2", title: "Kit academia", category: null, imageUrl: null, priceLabel: null, priceValue: null, priceFromLabel: null, link: "#", seller: "mercadolivre", couponCode: null, installment: null, highlight: false, freeShipping: false },
];

describe("category-filters", () => {
  it("builds Todos + real categories + Outros", () => {
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
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm vitest run tests/lib/storefront/category-filters.test.ts`

Expected: FAIL with `Cannot find module '../../lib/storefront/category-filters'` or missing export errors.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/lib/storefront/category-filters.test.ts
git commit -m "test: define storefront category filter behavior"
```

### Task 2: Implement pure category helpers

**Files:**
- Create: `lib/storefront/category-filters.ts`
- Update: `tests/lib/storefront/category-filters.test.ts` only if the failure exposed a bad test assumption

- [ ] **Step 1: Write the minimal implementation**

```ts
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

function isOtherCategory(category: string | null) {
  return !category || !category.trim();
}

function formatCategoryLabel(category: string) {
  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function buildCategoryOptions(products: Product[]): CategoryOption[] {
  const counts = new Map<string, number>();
  let otherCount = 0;

  for (const product of products) {
    if (isOtherCategory(product.category)) {
      otherCount += 1;
      continue;
    }

    const category = product.category!.trim();
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const categoryOptions = [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "pt-BR"))
    .map(([value, count]) => ({
      value,
      label: formatCategoryLabel(value),
      count,
    }));

  return [
    { value: ALL_CATEGORY_VALUE, label: "Todos", count: products.length },
    ...categoryOptions,
    ...(otherCount > 0
      ? [{ value: OTHER_CATEGORY_VALUE, label: "Outros", count: otherCount }]
      : []),
  ];
}

export function filterProducts(options: {
  products: Product[];
  searchQuery: string;
  selectedCategory: string;
}) {
  const normalizedQuery = normalizeText(options.searchQuery);

  return options.products.filter((product) => {
    const categoryMatches =
      options.selectedCategory === ALL_CATEGORY_VALUE
        ? true
        : options.selectedCategory === OTHER_CATEGORY_VALUE
          ? isOtherCategory(product.category)
          : product.category?.trim() === options.selectedCategory;

    if (!categoryMatches) {
      return false;
    }

    return normalizedQuery
      ? normalizeText(product.title).includes(normalizedQuery)
      : true;
  });
}
```

- [ ] **Step 2: Run the helper test to verify it passes**

Run: `pnpm vitest run tests/lib/storefront/category-filters.test.ts`

Expected: PASS with 2 tests green.

- [ ] **Step 3: Commit the helper module**

```bash
git add lib/storefront/category-filters.ts tests/lib/storefront/category-filters.test.ts
git commit -m "feat: add storefront category filtering helpers"
```

## Chunk 2: Interactive Catalog

### Task 3: Add failing integration coverage for hero order and category interaction

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Expand the storefront fixture data**

```ts
const products: Product[] = [
  { id: "1", title: "Panela de arroz", category: "kitchen", ... },
  { id: "2", title: "Kit academia", category: null, ... },
  { id: "3", title: "Mouse vertical", category: "office", ... },
];
```

- [ ] **Step 2: Add failing assertions for the new structure**

```ts
it("renders hero, search, categories, then products", () => {
  const view = renderStorefront();

  expect(view.container.textContent).toContain("Catalog for calm review");
  expect(view.container.textContent).toContain("Buscar no catalogo");
  expect(view.container.textContent).toContain("Todos");
  expect(view.container.textContent).toContain("Kitchen");
  expect(view.container.textContent).toContain("Outros");
});

it("combines category and search filters", () => {
  const view = renderStorefront();
  const othersButton = [...view.container.querySelectorAll("button")]
    .find((button) => button.textContent?.includes("Outros"));
  const input = view.container.querySelector("input[name='search']");

  act(() => {
    othersButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    Object.assign(input!, { value: "Kit" });
    input!.dispatchEvent(new Event("input", { bubbles: true }));
  });

  expect(view.container.textContent).toContain("Kit academia");
  expect(view.container.textContent).not.toContain("Panela de arroz");
});
```

- [ ] **Step 3: Run the targeted test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: FAIL because the category rail does not exist yet and the layout copy still reflects the old structure.

- [ ] **Step 4: Commit the failing integration test**

```bash
git add tests/components/storefront-client.test.tsx
git commit -m "test: cover storefront hero and category flow"
```

### Task 4: Implement the client-side category rail and combined filtering

**Files:**
- Create: `components/catalog/category-filter.tsx`
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/catalog/search-box.tsx`

- [ ] **Step 1: Create the category rail component**

```tsx
import type { CategoryOption } from "@/lib/storefront/category-filters";

type CategoryFilterProps = {
  options: CategoryOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export default function CategoryFilter({
  options,
  selectedValue,
  onValueChange,
}: CategoryFilterProps) {
  return (
    <section aria-label="Categorias do catalogo" className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-state={option.value === selectedValue ? "active" : "inactive"}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
          <span>{option.count}</span>
        </button>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Rebuild `StorefrontClient` around derived state**

```tsx
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
  <main>
    <StorefrontHeader ... />
    <section>
      <SearchBox value={searchQuery} onValueChange={setSearchQuery} />
    </section>
    <CategoryFilter
      options={availableCategories}
      selectedValue={selectedCategory}
      onValueChange={setSelectedCategory}
    />
    <section>{visibleProducts.length ? <ProductGrid ... /> : <EmptyState ... />}</section>
  </main>
);
```

- [ ] **Step 3: Refactor the search box to a horizontal full-width module**

```tsx
<section className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-quiet)]">
  <label className="grid gap-3 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-center">
    <span className="text-sm font-medium text-[var(--foreground)]">
      Buscar no catalogo
    </span>
    <input ... />
  </label>
</section>
```

- [ ] **Step 4: Run the storefront integration test to verify it passes**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: PASS with the category rail and combined filtering covered.

- [ ] **Step 5: Commit the interactive catalog changes**

```bash
git add components/catalog/category-filter.tsx components/catalog/search-box.tsx components/storefront/storefront-client.tsx tests/components/storefront-client.test.tsx
git commit -m "feat: add storefront category rail"
```

## Chunk 3: Visual Restructure

### Task 5: Add a failing product-card test for uncategorized label alignment

**Files:**
- Modify: `tests/components/product-card.test.tsx`

- [ ] **Step 1: Add the failing expectation**

```ts
it("labels uncategorized products as Outros", () => {
  renderProductCard({ category: null });
  expect(container.textContent).toContain("Outros");
});
```

- [ ] **Step 2: Run the product-card test to verify it fails**

Run: `pnpm vitest run tests/components/product-card.test.tsx`

Expected: FAIL because the card still renders `Curadoria geral`.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/components/product-card.test.tsx
git commit -m "test: align uncategorized product label"
```

### Task 6: Refactor hero, grid rhythm, and category visual language

**Files:**
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `components/catalog/product-grid.tsx`
- Modify: `components/catalog/product-card.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Convert `StorefrontHeader` into the full-height hero**

```tsx
<header className="relative flex min-h-[100svh] items-end overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-8 md:px-8 lg:px-12">
  <div className="relative max-w-4xl">
    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
      Divulgador Inteligente
    </p>
    <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
      Catalog for calm review
    </h1>
    <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
      Explore the current collection in four steps: context, search, categories, and products.
    </p>
  </div>
</header>
```

- [ ] **Step 2: Restyle the category rail and product section rhythm**

```tsx
// components/catalog/product-grid.tsx
export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section aria-label="Produtos visiveis" className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Catalogo aberto
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--foreground)]">
            Produtos visiveis
          </h2>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{products.length} registros</p>
      </div>
      <div className="grid gap-6 md:gap-7 xl:grid-cols-2 xl:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Align uncategorized chip copy and global spacing tokens**

```tsx
function getCategoryLabel(category: string | null) {
  if (!category || !category.trim()) {
    return "Outros";
  }

  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
```

```css
body {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(52, 64, 58, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(52, 64, 58, 0.025) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(143, 116, 93, 0.14), transparent 24%),
    radial-gradient(circle at bottom right, rgba(118, 135, 123, 0.18), transparent 28%);
}
```

- [ ] **Step 4: Run the targeted tests for the visual contract**

Run: `pnpm vitest run tests/components/product-card.test.tsx tests/components/storefront-client.test.tsx`

Expected: PASS with `Outros` and the new storefront copy rendered correctly.

- [ ] **Step 5: Commit the visual refactor**

```bash
git add app/globals.css components/storefront/storefront-header.tsx components/catalog/product-grid.tsx components/catalog/product-card.tsx tests/components/product-card.test.tsx
git commit -m "feat: refactor storefront hero layout"
```

## Chunk 4: Verification

### Task 7: Run the full verification sweep and capture manual QA notes

**Files:**
- Review: `app/page.tsx`
- Review: `components/storefront/storefront-client.tsx`
- Review: `app/globals.css`

- [ ] **Step 1: Run the focused Vitest suite**

Run: `pnpm vitest run tests/lib/storefront/category-filters.test.ts tests/components/storefront-client.test.tsx tests/components/product-card.test.tsx`

Expected: PASS with all new storefront tests green.

- [ ] **Step 2: Run the full project checks**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `pnpm build`
Expected: PASS with the home route still rendering under Next.js 16 without client-boundary regressions.

- [ ] **Step 3: Perform manual responsive QA**

Checklist:
- Open the app in `pnpm dev`
- Verify the hero fills the first viewport on desktop and mobile (`100svh`/`100vh` behavior is acceptable on the target browser)
- Verify the search bar spans the available width below the hero
- Verify category buttons wrap cleanly on narrow screens
- Verify `Todos`, a real category, and `Outros` all produce the expected catalog subset
- Verify the empty state still appears when text + category returns no products

- [ ] **Step 4: Commit the verified final state**

```bash
git add .
git commit -m "feat: ship storefront hero and category redesign"
```

