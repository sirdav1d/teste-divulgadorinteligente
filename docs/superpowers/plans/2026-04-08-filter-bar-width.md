# Filter Bar Width Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the storefront filter section so it aligns with the same container width used by the product list.

**Architecture:** Keep the change local to the storefront catalog client markup. Lock the desired filter-row class contract in the existing storefront client test, then remove the extra inner max-width constraint from the filter grid wrapper.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, Vitest

---

### Task 1: Align The Filter Row Width

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Modify: `components/storefront/storefront-catalog-client.tsx`

- [ ] **Step 1: Write the failing test**

Add a focused storefront render assertion that the filter grid under `#catalogo` keeps `w-full` and no longer uses `max-w-6xl`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: FAIL because the filter grid still renders `max-w-6xl`.

- [ ] **Step 3: Write minimal implementation**

Remove `max-w-6xl` from the filter grid wrapper in `components/storefront/storefront-catalog-client.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run focused verification**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
pnpm eslint components/storefront/storefront-catalog-client.tsx tests/components/storefront-client.test.tsx
```

Expected: PASS with no lint errors.
