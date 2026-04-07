# Storefront Layout Refactor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the public storefront layout into an airy analog-lab catalog while preserving the existing server-first data flow, local search behavior, and Next.js 16 route conventions.

**Architecture:** Keep `app/page.tsx` and the data layer unchanged and concentrate the work in global visual tokens plus presentational components. Treat this as a visual refactor with behavior-preserving tests: extend route-state coverage, keep the existing storefront search tests green, and add focused component tests where the new layout needs guardrails.

**Tech Stack:** Next.js 16.2.2, React 19.2.4, TypeScript 5, Tailwind CSS 4, `next/image`, `next/font`, Vitest, `jsdom`, native React DOM test utilities.

---

## Scope And Constraints

- Use `@frontend-design` to keep the chosen visual direction coherent: analog-lab, airy, premium, and sober.
- Use `@superpowers:test-driven-development` for every behavior or UI contract added in this refactor.
- Re-read `node_modules/next/dist/docs/` topics already relevant to this surface:
  - `01-app/01-getting-started/10-error-handling.md`
  - `01-app/01-getting-started/12-images.md`
  - `01-app/02-guides/testing/vitest.md`
- Do not change:
  - `app/page.tsx` data fetching behavior
  - client search behavior
  - coupon URL behavior
  - cart logic
- Do not add new state management for visual-only concerns.
- Do not introduce a new design system layer or large file moves.

## Planned File Structure

- Modify: `app/globals.css`
- Modify: `app/loading.tsx`
- Modify: `app/error.tsx`
- Modify: `app/global-error.tsx`
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `components/catalog/search-box.tsx`
- Modify: `components/catalog/product-card.tsx`
- Modify: `components/catalog/product-grid.tsx`
- Modify: `components/shared/status-banner.tsx`
- Modify: `components/shared/empty-state.tsx`
- Modify: `tests/components/storefront-client.test.tsx`
- Create: `tests/app/route-states.test.tsx`
- Create: `tests/components/product-card.test.tsx`

## Visual Direction To Preserve

- Palette: cool ivory, muted sage, deep graphite, restrained pale bronze accents
- Typography: `Fraunces` only for high-level headings, `Geist` for body and controls
- Composition: light, airy, catalog-like, no dense dashboard feel
- Surfaces: thin borders, soft shadows, quiet separators, minimal theatrics
- Motion: subtle only; hover and entry motion should feel refined, not promotional

## Chunk 1: Lock The UX Contracts Before Visual Changes

### Task 1: Add Route-State Regression Tests

**Files:**
- Create: `tests/app/route-states.test.tsx`
- Test: `app/loading.tsx`
- Test: `app/error.tsx`
- Test: `app/global-error.tsx`

- [ ] **Step 1: Write the failing route-state tests**

Create `tests/app/route-states.test.tsx` covering:
- `Loading` renders the heading `Preparing the catalog`
- `Loading` renders the supporting copy `Gathering products and coupons for the current issue.`
- `ErrorPage` renders the heading `Unable to open this issue`
- `ErrorPage` renders a retry button labeled `Reload segment`
- `GlobalErrorPage` renders the heading `The application lost its track`
- `GlobalErrorPage` renders a retry button labeled `Try to recover`

Example skeleton:

```tsx
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import Loading from "../../app/loading";

describe("route states", () => {
  it("renders the loading copy", () => {
    const html = renderToStaticMarkup(<Loading />);
    expect(html).toContain("Preparing the catalog");
  });
});
```

- [ ] **Step 2: Run the route-state tests to verify red**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx
```

Expected: FAIL because the new copy and structure do not exist yet.

- [ ] **Step 3: Implement the minimal route-state copy changes**

Update `app/loading.tsx`, `app/error.tsx`, and `app/global-error.tsx` so they expose the expected headings and buttons before any larger visual polish.

- [ ] **Step 4: Re-run the route-state tests**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the route-state contract**

Run:

```bash
git add app/loading.tsx app/error.tsx app/global-error.tsx tests/app/route-states.test.tsx
git commit -m "test: lock storefront route state copy"
```

### Task 2: Protect Product Card Content Before Restyling

**Files:**
- Create: `tests/components/product-card.test.tsx`
- Test: `components/catalog/product-card.tsx`

- [ ] **Step 1: Write the failing product-card tests**

Cover:
- seller label remains visible
- current price remains visible
- CTA label becomes `Open item record`
- missing image fallback renders `Image unavailable`

Example fixture shape:

```tsx
const product = {
  id: "1",
  title: "Analog headphone stand",
  imageUrl: null,
  priceLabel: "R$ 199,90",
  priceValue: 199.9,
  priceFromLabel: null,
  link: "https://example.com",
  seller: "amazon",
  couponCode: null,
  installment: null,
  highlight: false,
  freeShipping: false,
  category: "audio",
};
```

- [ ] **Step 2: Run the product-card tests to verify red**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx
```

Expected: FAIL because the new CTA and fallback copy do not exist yet.

- [ ] **Step 3: Implement the minimal text contract in `product-card.tsx`**

Update only the labels needed to make the tests pass. Do not restyle the whole card yet.

- [ ] **Step 4: Re-run the product-card tests**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the product-card content contract**

Run:

```bash
git add components/catalog/product-card.tsx tests/components/product-card.test.tsx
git commit -m "test: lock product card content contract"
```

## Chunk 2: Apply The Analog-Lab Visual System

### Task 3: Rebuild Global Tokens And Route-State Surfaces

**Files:**
- Modify: `app/globals.css`
- Modify: `app/loading.tsx`
- Modify: `app/error.tsx`
- Modify: `app/global-error.tsx`

- [ ] **Step 1: Re-read the current route-state components and token file**

Inspect:
- `app/globals.css`
- `app/loading.tsx`
- `app/error.tsx`
- `app/global-error.tsx`

Expected: identify which classes still feel like fallback starter UI rather than part of the catalog.

- [ ] **Step 2: Refactor the global design tokens**

Update `app/globals.css` to define:
- cooler background tones
- calmer surface colors
- a clearer border scale
- a restrained accent color
- optional utility custom properties for muted text and quiet shadows

Do not remove existing `--font-display` wiring.

- [ ] **Step 3: Refactor the loading screen into an airy catalog state**

Implement:
- a centered archival panel
- larger `Fraunces` heading
- quieter support text
- softer spacing and border rhythm

- [ ] **Step 4: Refactor `app/error.tsx` to match the same system**

Implement:
- one calm panel, not an alert box
- a stronger heading and muted explanatory copy
- a refined retry button treatment

- [ ] **Step 5: Refactor `app/global-error.tsx` to match the same system**

Keep the required `<html>` and `<body>` shell, but move away from the heavy dark fallback. Match the same analog-lab language as the loading and segment error views.

- [ ] **Step 6: Run the locked route-state tests**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit the route-state visual system**

Run:

```bash
git add app/globals.css app/loading.tsx app/error.tsx app/global-error.tsx
git commit -m "style: refactor storefront route states"
```

### Task 4: Refactor The Storefront Shell Into The Chosen Layout

**Files:**
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `components/catalog/search-box.tsx`
- Modify: `components/shared/status-banner.tsx`
- Modify: `components/shared/empty-state.tsx`
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Extend the storefront-client tests with the new shell copy**

Add assertions for:
- heading `Catalog for calm review`
- search panel label `Local filter`
- status label `Current reading`

Keep the existing search and empty-state behavior assertions intact.

- [ ] **Step 2: Run the storefront-client tests to verify red**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: FAIL because the current shell copy and structure do not match.

- [ ] **Step 3: Refactor `StorefrontHeader`**

Implement:
- a cleaner institutional hero
- a shorter headline
- one side panel for catalog metrics
- less decorative noise and less warm gradient volume

Use exact copy:
- heading: `Catalog for calm review`
- eyebrow: `Divulgador Inteligente`
- support copy: `A quieter storefront for products, coupons, and deliberate decision-making.`

- [ ] **Step 4: Refactor `SearchBox`**

Implement:
- label `Local filter`
- helper copy `Refine by product name without refetching the catalog.`
- more archival panel styling

- [ ] **Step 5: Refactor `StatusBanner`**

Implement:
- label `Current reading`
- less banner-like emphasis
- content that reads like context, not promotion

- [ ] **Step 6: Refactor `EmptyState`**

Keep the existing title `Nenhuma oferta combina com a busca atual.` and change only the layout language:
- lighter surface
- quieter spacing
- stronger typographic hierarchy

- [ ] **Step 7: Refactor the outer page composition in `StorefrontClient`**

Implement:
- more vertical rhythm
- more space between the filter column and main content
- calmer mobile stacking
- sticky filter only where it still feels light

Do not change the state model or derived filtering logic.

- [ ] **Step 8: Re-run the storefront-client tests**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit the storefront shell refactor**

Run:

```bash
git add components/storefront/storefront-client.tsx components/storefront/storefront-header.tsx components/catalog/search-box.tsx components/shared/status-banner.tsx components/shared/empty-state.tsx tests/components/storefront-client.test.tsx
git commit -m "style: refactor storefront shell layout"
```

### Task 5: Refactor Product Grid And Cards Into Premium Catalog Tiles

**Files:**
- Modify: `components/catalog/product-card.tsx`
- Modify: `components/catalog/product-grid.tsx`
- Test: `tests/components/product-card.test.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Re-run the product-card tests as a safety baseline**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx
```

Expected: PASS before visual restyling starts.

- [ ] **Step 2: Refactor `ProductGrid`**

Implement:
- a looser grid with more breathing room
- cleaner column behavior on wide screens
- spacing that supports taller cards

- [ ] **Step 3: Refactor `ProductCard`**

Implement:
- thinner chrome and less e-commerce energy
- metadata grouped quietly at the top
- image area with more breathing room
- stronger vertical rhythm between title, pricing, and CTA
- CTA styled as a subdued record action, not a sales button

Keep `next/image`, `fill`, and `sizes` valid for Next.js 16.

- [ ] **Step 4: Verify the content contract still holds**

Run:

```bash
pnpm vitest run tests/components/product-card.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Re-run the storefront-client tests**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the card and grid refactor**

Run:

```bash
git add components/catalog/product-card.tsx components/catalog/product-grid.tsx
git commit -m "style: refine product catalog cards"
```

## Chunk 3: Verification And Responsive QA

### Task 6: Validate The Visual Refactor End To End

**Files:**
- Modify: any touched file for final polish only if verification finds issues

- [ ] **Step 1: Run the focused UI suite**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx tests/components/storefront-client.test.tsx tests/components/product-card.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run the full project test suite**

Run:

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 3: Run static verification**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit with code `0`.

- [ ] **Step 4: Run manual responsive QA**

Run:

```bash
pnpm dev
```

Then verify at approximately:
- `390px` mobile width
- `768px` tablet width
- `1440px` desktop width

Check:
- the filter enters early on mobile
- the hero does not feel oversized on tablet
- the desktop layout feels airy rather than sparse
- loading and error states match the same visual family

- [ ] **Step 5: Apply only the final polish found in QA**

Fix spacing, typography, or responsive details only. Do not reopen copy or behavior unless a real problem is found.

- [ ] **Step 6: Re-run verification after any polish**

Run:

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: still PASS.

- [ ] **Step 7: Commit the verified visual refactor**

Run:

```bash
git add app/globals.css app/loading.tsx app/error.tsx app/global-error.tsx components/storefront components/catalog components/shared tests/app/route-states.test.tsx tests/components/storefront-client.test.tsx tests/components/product-card.test.tsx
git commit -m "style: complete storefront layout refactor"
```

## Delivery Notes

- Keep the current storefront behavior intact; this is not a data-layer task.
- Favor restraint over decoration. If a choice feels louder, denser, or more promotional, reject it.
- Use `@next-best-practices` when touching `next/image`, route-state files, or font-driven layout decisions.
- Use `@superpowers:verification-before-completion` before claiming the refactor is done.
