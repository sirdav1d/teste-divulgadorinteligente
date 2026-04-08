# Cart Quantity Controls Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add synchronized quantity controls to product cards and the cart sheet so users get immediate visual feedback after adding an item to the cart.

**Architecture:** Keep `StorefrontExperience` as the single owner of cart state and cart mutations. Introduce one shared quantity-control component, thread quantity and handlers through the catalog components, and replace the cart sheet remove UI with the same control pattern.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, Motion, Vitest

---

## Chunk 1: Lock The New Card And Sheet Behavior

### Task 1: Add failing product-card expectations

**Files:**
- Modify: `tests/components/product-card.test.tsx`
- Modify later: `components/catalog/product-card.tsx`

- [ ] **Step 1: Write the failing test**

Extend the product-card tests to cover both states:
- quantity `0` renders `Adicionar ao carrinho`
- quantity `2` renders decrement/increment controls and the current number

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/product-card.test.tsx`
Expected: FAIL because `ProductCard` does not yet accept quantity/control props.

- [ ] **Step 3: Write minimal implementation**

Update `ProductCard` to accept `quantity`, `onIncrement`, and `onDecrement`, while preserving the current CTA for quantity `0`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/components/product-card.test.tsx`
Expected: PASS.

### Task 2: Add failing storefront integration expectations

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Modify later: `components/storefront/storefront-experience.tsx`
- Modify later: `components/storefront/storefront-catalog-client.tsx`
- Modify later: `components/catalog/product-grid.tsx`
- Modify later: `components/cart/cart-sheet.tsx`
- Create later: `components/cart/cart-quantity-control.tsx`

- [ ] **Step 1: Write the failing test**

Add an integration test covering this sequence:
- click `Adicionar ao carrinho`
- verify the clicked card swaps to quantity controls with `1`
- open the cart sheet
- verify the same product shows the same quantity control state
- increment or decrement in one surface and verify the other surface stays synchronized
- decrement to `0` and verify the card returns to the single CTA

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: FAIL because card and sheet do not yet expose synchronized quantity controls.

---

## Chunk 2: Implement Shared Quantity Controls

### Task 3: Build the shared control

**Files:**
- Create: `components/cart/cart-quantity-control.tsx`

- [ ] **Step 1: Write minimal implementation**

Create a reusable control component with:
- decrement button
- quantity label
- increment button
- visual variants for card and sheet use cases

- [ ] **Step 2: Run targeted tests**

Run: `pnpm vitest run tests/components/product-card.test.tsx`
Expected: still failing only because the parent components are not yet wired.

### Task 4: Wire the product card flow

**Files:**
- Modify: `components/catalog/product-card.tsx`
- Modify: `components/catalog/product-grid.tsx`
- Modify: `components/storefront/storefront-catalog-client.tsx`
- Modify: `components/storefront/storefront-experience.tsx`

- [ ] **Step 1: Add quantity-aware props through the catalog tree**

Thread these props down to each card:
- `quantity`
- `onIncrement(product)`
- `onDecrement(productId)`

- [ ] **Step 2: Implement cart mutations in experience**

Split cart mutations into:
- increment/add
- decrement/remove-one
- clear

- [ ] **Step 3: Update product card rendering**

Use the shared quantity control when `quantity > 0`, otherwise render the existing add button.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx tests/components/storefront-client.test.tsx
```

Expected: product-card tests pass, storefront integration may still fail on cart-sheet expectations until the sheet is updated.

---

## Chunk 3: Bring The Cart Sheet In Line

### Task 5: Replace cart-sheet remove UI with the shared control

**Files:**
- Modify: `components/cart/cart-sheet.tsx`
- Modify: `components/storefront/storefront-experience.tsx`

- [ ] **Step 1: Update cart-sheet props**

Replace `onRemove(productId)` with quantity-aware callbacks:
- `onIncrement(product)`
- `onDecrement(productId)`

- [ ] **Step 2: Swap the sheet UI**

Remove the trash button and static quantity pill, and render the shared quantity control beside the line pricing/meta.

- [ ] **Step 3: Run integration tests**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

---

## Chunk 4: Final Verification

### Task 6: Run full focused verification

**Files:**
- Verify all touched files from previous tasks

- [ ] **Step 1: Run tests**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm eslint components/catalog/product-card.tsx components/catalog/product-grid.tsx components/storefront/storefront-catalog-client.tsx components/storefront/storefront-experience.tsx components/cart/cart-sheet.tsx components/cart/cart-quantity-control.tsx tests/components/product-card.test.tsx tests/components/storefront-client.test.tsx tests/components/cart-sheet.test.tsx
```

Expected: PASS with no lint errors.
