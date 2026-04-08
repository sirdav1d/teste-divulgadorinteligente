# Hero Catalog Initial Visibility Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the catalog bar from appearing in the viewport on initial load by ensuring the hero fills the visible viewport.

**Architecture:** Keep the fix local to the storefront header markup. Update the viewport-height utility classes on the hero wrappers and lock the intended class names in the existing header test.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, Vitest

---

### Task 1: Fix The Hero Viewport Height

**Files:**
- Modify: `tests/components/storefront-header.test.tsx`
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Write the failing test**

Update the existing header test to expect `min-h-dvh` and reject `min-h-svh`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-header.test.tsx`
Expected: FAIL because the component still renders `min-h-svh`.

- [ ] **Step 3: Write minimal implementation**

Change both hero wrapper class names in `components/storefront/storefront-header.tsx` from `min-h-svh` to `min-h-dvh`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/storefront-header.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run focused verification**

Run:

```bash
pnpm vitest run tests/components/storefront-header.test.tsx tests/components/storefront-client.test.tsx
pnpm eslint components/storefront/storefront-header.tsx tests/components/storefront-header.test.tsx
```

Expected: PASS with no lint errors.
