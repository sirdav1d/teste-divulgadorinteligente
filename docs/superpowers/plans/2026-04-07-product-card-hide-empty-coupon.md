# Product Card Hide Empty Coupon Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the empty coupon fallback text from product cards when a product has no coupon code.

**Architecture:** Keep the change local to `ProductCard`. Render the coupon label conditionally based on `product.couponCode` and leave the CTA as the only footer content when no coupon exists. Lock the behavior with a focused regression test in the existing product card test file.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Vitest

---

### Task 1: Lock the empty-coupon behavior in tests

**Files:**
- Modify: `tests/components/product-card.test.tsx`
- Test: `tests/components/product-card.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a focused assertion verifying that a card without `couponCode` does not render `Oferta sem cupom destacado`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/product-card.test.tsx`
Expected: FAIL because the fallback copy is still present.

- [ ] **Step 3: Write minimal implementation**

Update `components/catalog/product-card.tsx` to render the coupon text only when `product.couponCode` exists.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/product-card.test.tsx`
Expected: PASS

### Task 2: Verify the change

**Files:**
- Test: `tests/components/product-card.test.tsx`

- [ ] **Step 1: Run focused regression coverage**

Run: `npm test -- tests/components/product-card.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS
