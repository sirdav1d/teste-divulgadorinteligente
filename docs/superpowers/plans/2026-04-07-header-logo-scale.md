# Header Logo Scale Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase the storefront header logo by 20% without affecting the footer logo.

**Architecture:** Keep the change local to the server-rendered storefront header component. Update the responsive height classes that already define the rendered logo size, and lock the new sizing in a focused static markup test.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, Vitest

---

### Task 1: Lock The Larger Header Logo In Tests

**Files:**
- Modify: `tests/components/storefront-header.test.tsx`
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that the header logo markup includes the new responsive size classes and does not include the old ones.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-header.test.tsx`
Expected: FAIL because the component still renders `h-9 sm:h-10`.

- [ ] **Step 3: Write minimal implementation**

Update the header logo classes in `components/storefront/storefront-header.tsx` from `h-9 sm:h-10` to `h-11 sm:h-12`.

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
