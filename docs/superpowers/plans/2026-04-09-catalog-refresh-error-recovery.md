# Catalog Refresh Error Recovery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make client-side catalog refresh resilient so failed filter changes do not leave the URL, selected controls, and rendered grid out of sync, and so append failures do not surface as unhandled request errors.

**Architecture:** Keep the server-side catalog contract unchanged and fix the problem inside the client orchestration layer. Split catalog state into “committed” successful filters versus “in-flight” requested filters, only commit URL/filter snapshots after a successful refresh, and explicitly recover UI state on failure. Surface non-fatal refresh/load-more errors in the catalog client instead of letting them escape as runtime rejections.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Failure Behavior In Integration Tests

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Modify later: `hooks/storefront/use-storefront-catalog.ts`
- Modify later: `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 1: Add a failing test for filter refresh failure recovery**

Extend `tests/components/storefront-client.test.tsx` with a scenario where:
- the initial storefront render succeeds
- the next `/api/catalog` refresh rejects
- the user changes a filter or search term

Assert the intended recovery contract:
- the previously rendered products remain visible
- the URL remains on the last successful state instead of moving to the failed state
- the selected control value reverts to the last committed filter state
- a non-fatal error message is rendered in the catalog area

Use a mock like:

```ts
fetchMock
	.mockResolvedValueOnce({
		ok: true,
		json: async () => buildCatalogPage(),
	})
	.mockRejectedValueOnce(new Error('catalog refresh failed'));
```

- [ ] **Step 2: Add a failing test for load-more failure**

Add a second integration test where:
- the initial page loads normally
- the user clicks `Ver mais`
- the append request rejects

Assert that:
- the already loaded products remain rendered
- the load-more spinner is cleared
- a non-fatal error message appears
- the UI does not crash or switch to empty state

- [ ] **Step 3: Run the focused storefront integration test**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: FAIL because the current hook updates the URL and committed filters before the refresh succeeds and does not handle append failures explicitly.

---

### Task 2: Introduce Committed Filter State In The Catalog Hook

**Files:**
- Modify: `hooks/storefront/use-storefront-catalog.ts`
- Modify: `hooks/storefront/storefront-catalog-state.ts` if small shared helpers improve clarity
- Modify later: `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 1: Separate committed filters from in-flight UI selection**

Refactor `hooks/storefront/use-storefront-catalog.ts` so it keeps a clear distinction between:
- the last successful filter snapshot
- the currently selected UI values
- the request currently being attempted

The key invariant should be:
- `loadedProducts`, `availableCategories`, `nextOffset`, and URL always reflect the last successful request
- transient UI changes are not promoted to “committed” state until the refresh succeeds

A safe target shape is:

```ts
const committedFiltersRef = useRef<CatalogFilterState>(initialFilters);
const [selectedCategoryValue, setSelectedCategoryValue] = useState(initialFilters.category);
const [selectedCouponValue, setSelectedCouponValue] = useState(initialFilters.coupon);
const [searchQuery, setSearchQuery] = useState(initialFilters.search);
```

- [ ] **Step 2: Commit URL and last-successful filters only after refresh success**

Move the current optimistic commit work out of the effect body:
- do not set `lastAppliedFiltersRef.current = nextFilters` before the request succeeds
- do not call `window.history.replaceState(...)` before the request succeeds

Instead, in the refresh success branch:
- update `loadedProducts`
- update `availableCategories` if present
- update paging metadata
- commit the successful filter snapshot
- update the URL based on that committed snapshot

- [ ] **Step 3: Restore the UI controls when refresh fails**

In the refresh failure branch for non-abort errors:
- keep the currently rendered catalog data untouched
- restore `selectedCategoryValue`, `selectedCouponValue`, and `searchQuery` from the last committed snapshot
- leave the URL unchanged
- clear the loading state

This ensures the visible controls and visible products continue to describe the same catalog state.

- [ ] **Step 4: Keep retry behavior possible after failure**

Verify the hook does not get stuck after a failed refresh.

The minimal contract:
- after the controls are restored to the last committed snapshot, the user can make the same change again and the effect will issue a fresh request

Avoid any “already applied” bookkeeping that would suppress a legitimate retry of the failed filter change.

---

### Task 3: Add Explicit Non-Fatal Error State For Refresh And Append

**Files:**
- Modify: `hooks/storefront/use-storefront-catalog.ts`
- Modify: `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 1: Add explicit client error state to the hook**

Add hook state for catalog request failures, for example:

```ts
const [catalogError, setCatalogError] = useState<string | null>(null);
```

Use it for both:
- full refresh failures
- load-more failures

Clear the error when:
- a new request starts, or
- a request succeeds

- [ ] **Step 2: Catch append failures instead of relying on unhandled rejection behavior**

Wrap the `handleLoadMore` request in an explicit `.catch(...)` branch that:
- ignores abort errors if any are introduced later
- preserves already loaded products
- preserves `nextOffset` and `hasMoreProducts`
- sets a user-visible error message
- always clears `isLoadingMore`

Do not allow append failures to surface as unhandled promise rejections.

- [ ] **Step 3: Render the error as a local catalog status, not a route crash**

Update `components/storefront/storefront-catalog-client.tsx` to render a compact inline error surface above the grid and below the filter bar when `catalogError` is present.

The error surface should:
- be non-blocking
- not replace the successful grid data
- explain that the catalog could not be updated

A minimal text contract is enough, for example:

```tsx
<p role="status" aria-live="polite">
	Não foi possível atualizar o catálogo agora. Tente novamente.
</p>
```

Do not escalate this to a route-level error boundary because the last successful catalog state is still usable.

---

### Task 4: Verify The Recovery Contract End To End

**Files:**
- Modify as needed: files touched above

- [ ] **Step 1: Run the focused storefront integration tests**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS with the new recovery behavior.

- [ ] **Step 2: Run the full test suite**

Run:

```bash
pnpm vitest run
```

Expected: PASS.

- [ ] **Step 3: Run lint and typecheck**

Run:

```bash
pnpm eslint .
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Run the production build**

Run:

```bash
pnpm build
```

Expected: PASS, with unchanged route structure and no new build-time regressions.

---

### Task 5: Optional Hardening If Time Remains

**Files:**
- Modify only if needed: `tests/routes/catalog-route.test.ts`
- Modify only if needed: `docs/dossie-tecnico-do-projeto.md`

- [ ] **Step 1: Decide whether to document the new recovery contract**

If this behavior is considered part of the defended architecture, add a short note to the technical dossier explaining:
- URL changes are committed only after successful catalog refresh
- failed client refreshes preserve the last successful catalog snapshot

- [ ] **Step 2: Decide whether route-level tests need no-op confirmation**

No route change is required for the main fix, but if the implementation introduces new assumptions around error payloads, extend the route tests only as needed. Avoid widening the scope unnecessarily.
