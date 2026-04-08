# Helpers Architecture Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move internal helper logic out of `lib/` and component-local files into a domain-organized `helpers/` tree while preserving behavior.

**Architecture:** Keep `lib/` restricted to `api` and `types`, move internal helper modules into `helpers/`, and consolidate duplicated helper logic during the migration. Lock the architectural boundary with a failing test first, then move modules in small batches and update imports before deleting the obsolete files.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Architectural Boundary In Tests

**Files:**
- Create: `tests/architecture/helpers-architecture.test.ts`
- Modify later: `components/catalog/product-card.tsx`
- Modify later: `components/cart/cart-sheet.tsx`

- [ ] **Step 1: Write the failing architecture test**

Add assertions that:
- `lib/` only contains `api/divulgador.ts` and `types/divulgador.ts`
- `components/catalog/product-card.tsx` no longer declares `SELLER_LABELS` or `getSellerLabel`
- `components/cart/cart-sheet.tsx` no longer declares the pricing helper functions that should move to `helpers/cart/line-pricing.ts`

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts
```

Expected: FAIL because helper modules still exist in `lib/` and the component files still contain local helper logic.

### Task 2: Move Shared Internal Helpers Out Of `lib/`

**Files:**
- Create: `helpers/ui/cn.ts`
- Create: `helpers/storefront/category-filters.ts`
- Create: `helpers/storefront/coupon-filters.ts`
- Create: `helpers/storefront/seller-label.ts`
- Create: `helpers/url/read-single-search-param.ts`
- Create: `helpers/currency/parse-currency-value.ts`
- Create: `helpers/divulgador/build-url.ts`
- Create: `helpers/divulgador/normalizers.ts`
- Modify: `lib/api/divulgador.ts`
- Modify: `app/page.tsx`
- Modify: `components/catalog/category-filter.tsx`
- Modify: `components/catalog/product-card.tsx`
- Modify: `components/catalog/coupon-filter.tsx`
- Modify: `components/storefront/storefront-catalog-client.tsx`
- Modify: UI primitives and cart UI files that import `@/lib/utils`
- Modify: helper and API tests that import moved modules
- Delete later: `lib/utils.ts`
- Delete later: `lib/storefront/category-filters.ts`
- Delete later: `lib/storefront/coupon-filters.ts`
- Delete later: `lib/storefront/search-params.ts`
- Delete later: `lib/utils/currency.ts`
- Delete later: `lib/api/normalizers.ts`

- [ ] **Step 1: Create the new helper modules**

Copy the current logic into the new `helpers/` files without changing public behavior.

- [ ] **Step 2: Consolidate seller-label logic**

Move seller display-name mapping into `helpers/storefront/seller-label.ts` and make both product and coupon helper code depend on it.

- [ ] **Step 3: Update imports to the new helper locations**

Switch `app/`, `components/`, `lib/api/divulgador.ts`, and the related tests to the new `@/helpers/...` paths or updated relative test paths.

- [ ] **Step 4: Delete the obsolete `lib/` helper files**

Remove the old helper modules after all imports have been redirected.

- [ ] **Step 5: Run focused tests**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/lib/api/divulgador.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts tests/lib/storefront/search-params.test.ts
```

Expected: PASS.

### Task 3: Extract Component-Private Helpers Into `helpers/`

**Files:**
- Create: `helpers/cart/line-pricing.ts`
- Modify: `components/cart/cart-sheet.tsx`
- Modify: `components/catalog/product-card.tsx`
- Modify: `tests/components/cart-sheet.test.tsx`
- Modify: `tests/components/product-card.test.tsx`

- [ ] **Step 1: Write minimal helper modules**

Create `helpers/cart/line-pricing.ts` with the extracted cart pricing logic and make `product-card.tsx` use the shared seller-label helper.

- [ ] **Step 2: Remove local helper declarations from components**

Delete the local helper constants/functions from `product-card.tsx` and `cart-sheet.tsx` after wiring the imports.

- [ ] **Step 3: Run focused component tests**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/components/product-card.test.tsx tests/components/cart-sheet.test.tsx tests/components/storefront-client.test.tsx
```

Expected: PASS.

### Task 4: Run Final Verification For The Refactor

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run the full targeted verification set**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/lib/api/divulgador.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts tests/lib/storefront/search-params.test.ts tests/components/product-card.test.tsx tests/components/cart-sheet.test.tsx tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run ESLint on all touched source and test files**

Run:

```bash
pnpm eslint app/page.tsx components/catalog/category-filter.tsx components/catalog/coupon-filter.tsx components/catalog/product-card.tsx components/cart/cart-sheet.tsx components/cart/cart-quantity-control.tsx components/cart/cart-trigger.tsx components/storefront/storefront-catalog-client.tsx components/ui/button.tsx components/ui/command.tsx components/ui/dialog.tsx components/ui/input.tsx components/ui/input-group.tsx components/ui/popover.tsx components/ui/sheet.tsx components/ui/skeleton.tsx components/ui/textarea.tsx helpers/cart/line-pricing.ts helpers/currency/parse-currency-value.ts helpers/divulgador/build-url.ts helpers/divulgador/normalizers.ts helpers/storefront/category-filters.ts helpers/storefront/coupon-filters.ts helpers/storefront/seller-label.ts helpers/ui/cn.ts helpers/url/read-single-search-param.ts lib/api/divulgador.ts tests/architecture/helpers-architecture.test.ts tests/components/cart-sheet.test.tsx tests/components/product-card.test.tsx tests/components/storefront-client.test.tsx tests/lib/api/divulgador.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts tests/lib/storefront/search-params.test.ts
```

Expected: no lint errors.
