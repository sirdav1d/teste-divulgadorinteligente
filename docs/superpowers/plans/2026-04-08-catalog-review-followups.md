# Catalog Review Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the duplicate catalog refresh path and make category options come from the full remote catalog filtered only by coupon.

**Architecture:** Keep the first-page server render for direct entry, but make hydrated catalog interactions client-owned via `/api/catalog`. Extend the server catalog contract to return remote category options, switch client URL sync from `router.replace` to native history updates, and keep `<img>` usage unchanged.

**Tech Stack:** Next.js 16.2.2 App Router, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Extended Catalog Contract In Tests

**Files:**
- Modify: `types/catalog.ts`
- Modify: `tests/app/divulgador.test.ts`
- Modify: `tests/app/catalog-route.test.ts`

- [ ] **Step 1: Write the failing data-layer and route tests**

Add tests that assert:
- `getCatalogPage()` returns `availableCategories`
- category options are derived from the full remote catalog under the active coupon context
- search text does not affect returned category options
- `/api/catalog` returns the extended payload

- [ ] **Step 2: Run the failing tests**

Run:

```bash
pnpm vitest run tests/app/divulgador.test.ts tests/app/catalog-route.test.ts
```

Expected: FAIL because the current contract does not expose remote category options.

- [ ] **Step 3: Implement the minimal contract changes**

Update the catalog types and extend the server-side catalog assembly so it computes `availableCategories` from the full remote dataset filtered only by coupon.

- [ ] **Step 4: Re-run the targeted server tests**

Run:

```bash
pnpm vitest run tests/app/divulgador.test.ts tests/app/catalog-route.test.ts
```

Expected: PASS.

### Task 2: Remove The Duplicate Client Refresh Path

**Files:**
- Modify: `hooks/storefront/use-storefront-catalog.ts`
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Write the failing storefront integration tests**

Update the storefront suite to assert:
- filter/search changes no longer call `router.replace`
- the URL is still synchronized
- the client still fetches `/api/catalog`

- [ ] **Step 2: Run the storefront test to verify it fails**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: FAIL because the hook still uses `router.replace`.

- [ ] **Step 3: Implement the minimal hook refactor**

Replace `router.replace` with `window.history.replaceState` and keep the catalog refresh flow entirely client-owned after hydration.

- [ ] **Step 4: Re-run the storefront test**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

### Task 3: Wire Remote Category Options Through The Storefront

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/storefront/storefront-experience.tsx`
- Modify: `hooks/storefront/use-storefront-catalog.ts`
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Extend the storefront integration tests**

Add assertions that:
- category options include categories not present in the first loaded page when they exist in the remote catalog
- search does not shrink the category option list
- changing coupon refreshes category options

- [ ] **Step 2: Run the storefront test to verify it fails**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: FAIL because categories are still derived from `browseProducts`.

- [ ] **Step 3: Implement the minimal storefront wiring**

Pass `availableCategories` from the initial server render, refresh them from `/api/catalog`, and stop deriving category options from client-loaded products.

- [ ] **Step 4: Re-run the storefront test**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

### Task 4: Final Verification

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run TypeScript verification**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 2: Run the focused test suite**

Run:

```bash
pnpm vitest run tests/app/divulgador.test.ts tests/app/catalog-route.test.ts tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run focused ESLint**

Run:

```bash
pnpm eslint app/page.tsx app/api/catalog/route.ts lib/divulgador.ts types/catalog.ts hooks/storefront/use-storefront-catalog.ts components/storefront/storefront-client.tsx components/storefront/storefront-experience.tsx tests/app/divulgador.test.ts tests/app/catalog-route.test.ts tests/components/storefront-client.test.tsx
```

Expected: no lint errors.
