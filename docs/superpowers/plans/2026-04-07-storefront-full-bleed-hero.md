# Storefront Full Bleed Hero Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the storefront hero into a true full-bleed section while keeping the catalog content in the existing centered container below it.

**Architecture:** Split the page layout into two zones: a viewport-width hero rendered outside the centered page shell, and a separate inner wrapper for search, categories, and product grid. Keep the hero media absolute and full-size, but move the text content into an internal max-width wrapper so readability stays aligned with the rest of the storefront.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Vitest, react-dom/server

---

## Chunk 1: Lock the full-bleed behavior in tests

### Task 1: Add failing assertions for the new hero shell

**Files:**
- Modify: `tests/components/storefront-header.test.tsx`
- Test: `tests/components/storefront-header.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that verify:
- the root hero no longer uses the rounded card shell
- the root hero still uses `min-h-svh`
- the header contains an internal `mx-auto w-full max-w-[92rem]` content wrapper

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/storefront-header.test.tsx`
Expected: FAIL because the current header still renders the rounded outer shell and lacks the new internal wrapper contract.

- [ ] **Step 3: Write minimal implementation**

Update `components/storefront/storefront-header.tsx` to remove the outer rounded shell and add the internal centered wrapper without changing the copy or media assets.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/storefront-header.test.tsx`
Expected: PASS

### Task 2: Add failing assertions for page-level layout separation

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that verify:
- the hero renders outside the centered `max-w-[92rem]` catalog shell
- the catalog shell still exists below the hero
- the `main` wrapper no longer applies the global horizontal page padding that constrained the hero

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/storefront-client.test.tsx`
Expected: FAIL because the current client layout still nests the hero inside the centered shell.

- [ ] **Step 3: Write minimal implementation**

Update `components/storefront/storefront-client.tsx` so the hero is the first full-width child and the remaining storefront sections move into a separate centered wrapper.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/storefront-client.test.tsx`
Expected: PASS

## Chunk 2: Verify the integrated storefront

### Task 3: Run focused regression coverage

**Files:**
- Test: `tests/components/storefront-header.test.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Run the focused storefront tests**

Run: `npm test -- tests/components/storefront-header.test.tsx tests/components/storefront-client.test.tsx`
Expected: PASS

- [ ] **Step 2: Run repo verification**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run production build verification**

Run: `npm run build`
Expected: PASS
