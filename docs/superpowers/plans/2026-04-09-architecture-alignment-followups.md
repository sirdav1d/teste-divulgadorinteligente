# Architecture Alignment Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the current codebase into closer alignment with the architectural rules in `AGENTS.md` by tightening type ownership, reducing cross-layer coupling, shrinking the hero client boundary, removing dead helper surface area, and finishing the cleanup of fragile tests.

**Architecture:** Keep the refactor structural and incremental. First lock the intended boundaries in architecture tests, then move shared contracts into `types/`, extract category-option assembly out of `helpers/storefront`, and finally reduce the hero subtree to the minimum necessary client island. Preserve the approved decisions already documented in `AGENTS.md`, especially the continued use of native `<img>` for dynamic remote assets.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The New Architecture Rules In Tests

**Files:**
- Modify: `tests/architecture/helpers-architecture.test.ts`
- Modify: `tests/architecture/storefront-boundaries.test.ts`
- Modify later: `components/catalog/category-filter.tsx`
- Modify later: `components/catalog/coupon-filter.tsx`
- Modify later: `lib/divulgador/catalog.ts`
- Modify later: `tests/components/cart-sheet.test.tsx`

- [ ] **Step 1: Tighten the helpers/types boundary assertions**

Add architecture assertions that:
- `components/catalog/category-filter.tsx` does not import `CategoryOption` from `@/helpers/...`
- `components/catalog/coupon-filter.tsx` does not import `CouponOption` from `@/helpers/...`
- `lib/divulgador/catalog.ts` does not import `buildCategoryOptions` from `@/helpers/storefront/category-filters`
- no production source file imports structural filter option types from helper modules

- [ ] **Step 2: Tighten the storefront boundary assertions**

Update the storefront architecture test to assert:
- the hero subtree has a dedicated static shell component
- the motion/scroll client behavior lives in a smaller dedicated client island
- the static header shell is not marked with `'use client'`

- [ ] **Step 3: Tighten the testing-rule assertions**

Add an assertion that `tests/components/cart-sheet.test.tsx` no longer depends on `className.includes('overflow-y-auto')`.

- [ ] **Step 4: Run the architecture tests to verify they fail**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/architecture/storefront-boundaries.test.ts
```

Expected: FAIL because the current code still imports filter option types from helpers, `lib/divulgador/catalog.ts` still depends on a storefront helper, the hero shell is still too broad, and `cart-sheet.test.tsx` still uses a class-based assertion.

### Task 2: Move Shared Filter Contracts Into `types/`

**Files:**
- Modify: `types/catalog.ts`
- Modify: `helpers/storefront/category-filters.ts`
- Modify: `helpers/storefront/coupon-filters.ts`
- Modify: `components/catalog/category-filter.tsx`
- Modify: `components/catalog/coupon-filter.tsx`
- Modify: `hooks/storefront/use-storefront-catalog.ts`
- Modify: any tests that import the moved types

- [ ] **Step 1: Add shared filter option contracts to `types/`**

Move the structural contracts for category and coupon filter options into `types/catalog.ts` or a new `types/storefront.ts`.

The target contracts should be shared application types only:
- category option shape
- coupon option shape
- any small supporting aliases needed by both helpers and components

- [ ] **Step 2: Update helper modules to consume the root type contracts**

Make `helpers/storefront/category-filters.ts` and `helpers/storefront/coupon-filters.ts` import and return the shared types from `@/types/...` instead of declaring their own exported type definitions.

- [ ] **Step 3: Update components and hooks to import only from `types/`**

Redirect:
- `components/catalog/category-filter.tsx`
- `components/catalog/coupon-filter.tsx`
- any hook or test still depending on helper-owned contracts

Use `@/types/...` imports for structural types and keep helpers responsible only for runtime behavior.

- [ ] **Step 4: Run the focused filter and architecture tests**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/components/storefront/category-filters.test.ts tests/components/storefront/coupon-filters.test.ts
```

Expected: PASS.

### Task 3: Remove The `lib` -> `helpers/storefront` Coupling For Category Aggregation

**Files:**
- Create: `lib/divulgador/categories.ts`
- Modify: `lib/divulgador/catalog.ts`
- Modify: `lib/divulgador/scan.ts`
- Modify: `helpers/storefront/category-filters.ts`
- Modify: `types/catalog.ts` or `types/storefront.ts`
- Modify: `tests/app/divulgador.test.ts`
- Modify: `tests/architecture/helpers-architecture.test.ts`

- [ ] **Step 1: Extract category-option assembly into the data layer**

Create a dedicated module under `lib/divulgador/` for category aggregation and option assembly used by catalog responses.

This module should own:
- category counting from products
- construction of `availableCategories`
- any domain-specific knowledge used by the server-side catalog layer

It should not live in `helpers/storefront/`, because that folder is currently acting as a UI-facing utility surface.

- [ ] **Step 2: Repoint the catalog data layer to the new module**

Make:
- `lib/divulgador/catalog.ts`
- `lib/divulgador/scan.ts`

depend on the new `lib/divulgador/categories.ts` module instead of `@/helpers/storefront/category-filters`.

- [ ] **Step 3: Trim `helpers/storefront/category-filters.ts` down to UI-safe runtime helpers**

Keep only the category formatting/runtime helpers that are genuinely used by UI code.

If the current production code no longer needs certain exports after the move, delete them instead of leaving them behind.

- [ ] **Step 4: Run the catalog and architecture verification**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/app/divulgador.test.ts tests/app/catalog-route.test.ts
```

Expected: PASS.

### Task 4: Reduce The Hero Client Boundary

**Files:**
- Create: `components/storefront/storefront-header-shell.tsx`
- Create: `components/storefront/storefront-hero-motion.tsx`
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `components/storefront/storefront-hero-client.tsx`
- Modify: `components/storefront/storefront-hero-media.tsx`
- Modify: `hooks/storefront/use-hero-scroll-reveal.ts`
- Modify: `tests/architecture/storefront-boundaries.test.ts`
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Establish the static/server portion of the hero**

Create a static header shell component responsible only for markup and static content:
- logo
- layout structure
- static title text
- media placement slots
- top-bar slot placement

This shell should be a Server Component unless a hard technical constraint requires otherwise.

- [ ] **Step 2: Isolate motion and scroll behavior into a smaller client island**

Keep client-only behavior in a dedicated component responsible for:
- `motion` bindings
- `useHeroScrollReveal`
- any animated media wrapper
- browser-only state required for hero interaction

Do not broaden the client surface beyond what the animation actually needs.

- [ ] **Step 3: Keep the approved asset policy intact**

Do not migrate hero images or logos to `next/image`.
Continue using native `<img>` where currently used, because the project policy explicitly allows that for dynamic asset constraints.

- [ ] **Step 4: Run the storefront tests**

Run:

```bash
pnpm vitest run tests/architecture/storefront-boundaries.test.ts tests/components/storefront-client.test.tsx
```

Expected: PASS with the smaller hero client island and unchanged storefront behavior.

### Task 5: Remove Dead Helper Surface Area

**Files:**
- Modify: `helpers/storefront/category-filters.ts`
- Modify: `tests/components/storefront/category-filters.test.ts`
- Modify later: any production caller if one is intentionally added during the refactor

- [ ] **Step 1: Confirm whether `filterProducts` has a production caller**

Re-check the production graph. If `filterProducts` is still test-only, remove it from the public helper surface.

- [ ] **Step 2: Trim the related test to the still-supported public API**

Update `tests/components/storefront/category-filters.test.ts` so it validates only the helper behavior that remains part of the supported runtime API.

- [ ] **Step 3: Run the focused helper tests**

Run:

```bash
pnpm vitest run tests/components/storefront/category-filters.test.ts tests/architecture/helpers-architecture.test.ts
```

Expected: PASS.

### Task 6: Finish The Cleanup Of Fragile Presentation Tests

**Files:**
- Modify: `tests/components/cart-sheet.test.tsx`
- Modify: any adjacent component test that still uses presentation-only assertions

- [ ] **Step 1: Replace the class-based cart-sheet assertion**

Remove the `className.includes('overflow-y-auto')` check and replace it with a behaviorally meaningful assertion tied to:
- stable DOM slot structure
- empty-state presence
- cart body content contract

Do not reintroduce assertions tied mainly to Tailwind classes or layout wrappers.

- [ ] **Step 2: Search for remaining presentation-only assertions in the touched scope**

Check the touched test files for:
- direct Tailwind class assertions
- wrapper-structure assumptions with no behavioral value
- hard coupling to non-contractual copy

Remove or replace them only where they are still fragile.

- [ ] **Step 3: Run the component test suite**

Run:

```bash
pnpm vitest run tests/components/cart-sheet.test.tsx tests/components/product-card.test.tsx tests/components/product-grid.test.tsx tests/components/storefront-client.test.tsx
```

Expected: PASS.

### Task 7: Final Verification

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run the full test suite**

Run:

```bash
pnpm vitest run
```

Expected: PASS.

- [ ] **Step 2: Run ESLint across the repository**

Run:

```bash
pnpm eslint .
```

Expected: no lint errors.

- [ ] **Step 3: Run TypeScript verification**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 4: Run the production build**

Run:

```bash
pnpm build
```

Expected: PASS and the home route continues to build correctly.
