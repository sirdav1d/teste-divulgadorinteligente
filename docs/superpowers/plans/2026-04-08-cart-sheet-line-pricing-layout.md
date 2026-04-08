# Cart Sheet Line Pricing And Layout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each cart-sheet line show quantity-aware pricing and remove the visual gap below product images when the content column becomes taller.

**Architecture:** Keep the change local to the cart sheet rendering logic. Lock the expected line-pricing copy in tests first, then update the line-price block to display unit-price detail plus computed line total, and adjust the image wrapper so it stretches more naturally with the line content.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, Vitest

---

### Task 1: Lock The Quantity-Aware Line Pricing In Tests

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Modify: `tests/components/cart-sheet.test.tsx`
- Modify later: `components/cart/cart-sheet.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that a cart line with quantity greater than `1` renders:
- small copy like `2 x R$ 269,82`
- highlighted line total like `R$ 539,64`

Keep the existing empty-state coverage intact.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
```

Expected: FAIL because the cart sheet still shows only the unit price as the highlighted value.

- [ ] **Step 3: Write minimal implementation**

In `components/cart/cart-sheet.tsx`:
- add a helper that formats a single line total from `priceValue * quantity`
- render quantity × unit price as small copy
- render computed line total as the highlighted amount
- preserve the existing fallback when numeric pricing is missing

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
```

Expected: PASS.

### Task 2: Remove The Visual Gap Under Product Images

**Files:**
- Modify: `components/cart/cart-sheet.tsx`

- [ ] **Step 1: Adjust the line layout**

Update the line item wrapper so the image column is no longer a fixed square that leaves a visible gap below it when the content grows taller.

- [ ] **Step 2: Keep image presentation stable**

Preserve:
- rounded corners
- `object-cover`
- a minimum height so compact lines still look balanced

- [ ] **Step 3: Run focused verification**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
pnpm eslint components/cart/cart-sheet.tsx tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
```

Expected: PASS with no lint errors.
