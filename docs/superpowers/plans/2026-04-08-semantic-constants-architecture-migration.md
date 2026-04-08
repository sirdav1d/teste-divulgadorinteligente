# Semantic Constants Architecture Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move semantic/configurable values into a dedicated `constants/` tree while keeping behavior in `helpers/` and preserving runtime behavior.

**Architecture:** Create domain-scoped constant modules under `constants/`, update helpers/components/integration code to import from them, and extend the architecture test so the new boundary is enforced. The migration is structural only, so the main risks are missing imports and accidentally over-extracting local implementation details.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Constants Boundary In Tests

**Files:**
- Modify: `tests/architecture/helpers-architecture.test.ts`
- Modify later: `helpers/storefront/category-filters.ts`
- Modify later: `helpers/storefront/coupon-filters.ts`
- Modify later: `helpers/storefront/seller-label.ts`
- Modify later: `helpers/divulgador/build-url.ts`
- Modify later: `lib/api/divulgador.ts`
- Modify later: `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 1: Write the failing architecture test**

Add assertions that:
- `constants/divulgador/api.ts`
- `constants/storefront/filters.ts`
- `constants/storefront/pagination.ts`
- `constants/storefront/sellers.ts`

must exist, and the following source files must no longer define the moved values inline:
- `helpers/storefront/category-filters.ts`
- `helpers/storefront/coupon-filters.ts`
- `helpers/storefront/seller-label.ts`
- `helpers/divulgador/build-url.ts`
- `lib/api/divulgador.ts`
- `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts
```

Expected: FAIL because `constants/` files do not exist yet and the semantic values are still declared inline.

### Task 2: Create Constants Modules And Redirect Imports

**Files:**
- Create: `constants/divulgador/api.ts`
- Create: `constants/storefront/filters.ts`
- Create: `constants/storefront/pagination.ts`
- Create: `constants/storefront/sellers.ts`
- Modify: `helpers/storefront/category-filters.ts`
- Modify: `helpers/storefront/coupon-filters.ts`
- Modify: `helpers/storefront/seller-label.ts`
- Modify: `helpers/divulgador/build-url.ts`
- Modify: `lib/api/divulgador.ts`
- Modify: `components/storefront/storefront-catalog-client.tsx`
- Modify: `components/catalog/coupon-filter.tsx`
- Modify: tests that import moved constants

- [ ] **Step 1: Create the constants files**

Add the new domain constants modules with the extracted semantic values:
- `API_BASE_URL`
- `SITE_NAME`
- `ALL_CATEGORY_VALUE`
- `OTHER_CATEGORY_VALUE`
- `ALL_COUPON_VALUE`
- `PAGE_SIZE`
- `SELLER_LABELS`

- [ ] **Step 2: Update helpers and app code to import the constants**

Replace inline declarations with imports from `@/constants/...`.

- [ ] **Step 3: Update tests that import filter constants**

Redirect the existing storefront helper tests to the new constant modules where needed.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts tests/lib/api/divulgador.test.ts
```

Expected: PASS.

### Task 3: Run Final Verification

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run TypeScript verification**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 2: Run the final targeted test suite**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/lib/api/divulgador.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts tests/lib/storefront/search-params.test.ts tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run ESLint on all touched files**

Run:

```bash
pnpm eslint constants/divulgador/api.ts constants/storefront/filters.ts constants/storefront/pagination.ts constants/storefront/sellers.ts helpers/storefront/category-filters.ts helpers/storefront/coupon-filters.ts helpers/storefront/seller-label.ts helpers/divulgador/build-url.ts lib/api/divulgador.ts components/storefront/storefront-catalog-client.tsx components/catalog/coupon-filter.tsx tests/architecture/helpers-architecture.test.ts tests/lib/api/divulgador.test.ts tests/lib/storefront/category-filters.test.ts tests/lib/storefront/coupon-filters.test.ts
```

Expected: no lint errors.
