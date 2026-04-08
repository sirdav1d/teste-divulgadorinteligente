# Remote Catalog Pagination Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current local-only "Ver mais" behavior with real remote pagination, while keeping coupon, category, and name search valid across the full remote catalog.

**Architecture:** Add an app-owned paginated catalog layer on top of the Divulgador API. The server page loads the first catalog page, a route handler serves subsequent pages for the client, and the storefront client accumulates remote pages while resetting correctly when filters change. Search remains app-owned by scanning remote API pages on the server because the external API pagination is usable but text search could not be verified.

**Tech Stack:** Next.js 16.2.2 App Router, TypeScript, React, Vitest, ESLint

---

### Task 1: Lock The Paginated Catalog Contract In Tests

**Files:**
- Create: `types/catalog.ts`
- Modify: `lib/divulgador.ts`
- Modify: `tests/app/divulgador.test.ts`

- [ ] **Step 1: Write the failing data-layer tests**

Add tests that define the new contract and fetch behavior:
- a paginated product fetch sends the requested `start` and `limit`
- a catalog-page fetch without search returns `{ products, hasMore, nextOffset }`
- a catalog-page fetch with search keeps scanning remote pages until it fills one local page or exhausts the API

- [ ] **Step 2: Run the targeted data-layer tests to verify they fail**

Run:

```bash
pnpm vitest run tests/app/divulgador.test.ts
```

Expected: FAIL because the paginated catalog functions and contract do not exist yet.

- [ ] **Step 3: Write the minimal paginated data-layer implementation**

Add the shared catalog page types, expand the Divulgador fetcher to support arbitrary `start` and `limit`, and introduce an app-owned catalog function that:
- passes `coupon` and `category` remotely
- computes `hasMore` and `nextOffset`
- performs server-side title filtering by scanning remote pages when `search` is present

- [ ] **Step 4: Re-run the targeted data-layer tests**

Run:

```bash
pnpm vitest run tests/app/divulgador.test.ts
```

Expected: PASS.

### Task 2: Expose Catalog Pagination Through An Internal Route

**Files:**
- Create: `app/api/catalog/route.ts`
- Create: `tests/app/catalog-route.test.ts`

- [ ] **Step 1: Write the failing route-handler tests**

Add tests that assert:
- the route reads `offset`, `coupon`, `category`, and `search` from the query string
- invalid or missing `offset` falls back to `0`
- the JSON payload matches the catalog page contract returned by the app-owned catalog function

- [ ] **Step 2: Run the route-handler tests to verify they fail**

Run:

```bash
pnpm vitest run tests/app/catalog-route.test.ts
```

Expected: FAIL because the route does not exist yet.

- [ ] **Step 3: Write the minimal route handler**

Implement `GET` in `app/api/catalog/route.ts` and delegate to the catalog page function using `NextRequest`.

- [ ] **Step 4: Re-run the route-handler tests**

Run:

```bash
pnpm vitest run tests/app/catalog-route.test.ts
```

Expected: PASS.

### Task 3: Replace Local Slice Pagination In The Storefront Client

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/storefront/storefront-experience.tsx`
- Modify: `components/storefront/storefront-catalog-client.tsx`
- Modify: `components/catalog/product-grid.tsx`
- Modify: `components/catalog/search-box.tsx`
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Write the failing storefront integration tests**

Update the storefront test suite to define the new behavior:
- initial render shows the first remote page
- clicking `Ver mais` appends products fetched from `/api/catalog` instead of just revealing existing hidden items
- changing search resets the accumulated list and searches across remote pages
- changing category resets the accumulated list and keeps category filtering remote

- [ ] **Step 2: Run the storefront integration tests to verify they fail**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: FAIL because the storefront still slices the initial array locally and does not fetch remote pages.

- [ ] **Step 3: Write the minimal client and page implementation**

Implement the new flow:
- `app/page.tsx` reads `search` and fetches the first catalog page
- `StorefrontClient` and `StorefrontExperience` accept the initial catalog page metadata
- `StorefrontCatalogClient` tracks `loadedProducts`, `nextOffset`, `hasMore`, and `isLoadingMore`
- `SearchBox` remains controlled but the catalog client now resets remote pagination on filter changes
- `ProductGrid` receives explicit remote pagination state instead of inferring from `totalCount > products.length`

- [ ] **Step 4: Re-run the storefront integration tests**

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
pnpm eslint app/page.tsx app/api/catalog/route.ts lib/divulgador.ts types/catalog.ts components/storefront/storefront-client.tsx components/storefront/storefront-experience.tsx components/storefront/storefront-catalog-client.tsx components/catalog/product-grid.tsx components/catalog/search-box.tsx tests/app/divulgador.test.ts tests/app/catalog-route.test.ts tests/components/storefront-client.test.tsx
```

Expected: no lint errors.
