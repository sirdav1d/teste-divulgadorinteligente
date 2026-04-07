# Divulgador Inteligente Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing Next.js 16 starter into a polished storefront for products and coupons, with local search, URL-driven coupon filtering, a local cart, and automated tests for the critical behaviors.

**Architecture:** Build on the current Next.js 16.2.2 + React 19 + Tailwind CSS 4 scaffold instead of recreating project setup from scratch. Keep `app/page.tsx` as an async Server Component that awaits async `searchParams`, fetches products and coupons in parallel through cache-aware server helpers, and passes only the serializable view model needed by a small synchronous client subtree. Keep cart state in a dedicated client provider imported by the server layout so `app/layout.tsx` remains server-rendered, and drive coupon filtering through URL state plus client navigation rather than browser-to-third-party reads or client-side reads of the third-party API.

**Tech Stack:** Next.js 16.2.2, React 19.2.4, TypeScript 5, Tailwind CSS 4, `next/image`, `next/font`, Vitest, `jsdom`, `@vitejs/plugin-react`, native React/DOM test utilities.

---

## Current Project Baseline

- The project already has a working scaffold with:
  - `package.json`
  - `next.config.ts`
  - `eslint.config.mjs`
  - `postcss.config.mjs`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/globals.css`
  - `public/*` starter assets
- The current app is still the default starter page.
- `README.md` does not exist in the restored branch and must be created.
- `next-env.d.ts` is not currently present in the working tree and should be generated or recreated as part of the setup verification flow.
- Existing dependency versions already pin:
  - `next@16.2.2`
  - `react@19.2.4`
  - `react-dom@19.2.4`
  - Tailwind CSS 4 toolchain

## Planning Constraints From The Current Stack

- Follow the shipped Next.js 16 docs in `node_modules/next/dist/docs/` before implementing code.
- Treat `searchParams`, `params`, `cookies()` and `headers()` as async when used in App Router code.
- Prefer server-side reads in Server Components over client-side reads.
- Keep server/client boundaries explicit and pass only serializable props into client components.
- Do not make client components async; fetch in server parents and pass data down.
- Avoid `useSearchParams()` in the main client subtree for this route. Pass the selected coupon from the server page props and use client navigation only to update the URL.
- Use `next/image` for remote product images and configure `images.remotePatterns` in `next.config.ts`.
- If `cacheComponents` is enabled, use `'use cache'` only for data that does not require per-request freshness.

## Planned File Structure

- Modify: `package.json`
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `eslint.config.mjs`
- Create: `README.md`
- Create: `app/loading.tsx`
- Create: `app/error.tsx`
- Create: `app/global-error.tsx`
- Create: `components/providers/cart-provider.tsx`
- Create: `components/storefront/storefront-client.tsx`
- Create: `components/storefront/storefront-header.tsx`
- Create: `components/catalog/product-card.tsx`
- Create: `components/catalog/product-grid.tsx`
- Create: `components/catalog/search-box.tsx`
- Create: `components/coupons/coupon-list.tsx`
- Create: `components/cart/cart-panel.tsx`
- Create: `components/cart/cart-item.tsx`
- Create: `components/shared/empty-state.tsx`
- Create: `components/shared/status-banner.tsx`
- Create: `lib/types/divulgador.ts`
- Create: `lib/api/normalizers.ts`
- Create: `lib/api/divulgador.ts`
- Create: `lib/cart/cart-reducer.ts`
- Create: `lib/utils/currency.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tests/lib/api/divulgador.test.ts`
- Create: `tests/lib/cart/cart-reducer.test.ts`
- Create: `tests/components/storefront-client.test.tsx`
- Create: `tests/components/cart-panel.test.tsx`

## API Notes

- Products endpoint: `https://api.divulgadorinteligente.com/api/products?sitename=espionandopromos&start=0&limit=20`
- Coupons endpoint: `https://api.divulgadorinteligente.com/api/coupons/public?sitename=espionandopromos&start=0&limit=10&featured=false`
- Coupon-filtered products endpoint: `https://api.divulgadorinteligente.com/api/products?sitename=espionandopromos&start=0&limit=20&sellers[]=magalu&coupon={coupon-name}`
- API payloads are nested inside `data[].attributes`.
- Product prices are formatted strings such as `R$ 269,82`; normalize them into:
  - `priceLabel` for display
  - `priceValue` as numeric value for subtotal math
- Observed remote image hosts already returned by the API include:
  - `http2.mlstatic.com`
  - `m.media-amazon.com`

## Chunk 1: Align The Existing Starter

### Task 1: Convert The Starter Into A Real Project Foundation

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `eslint.config.mjs`
- Create: `app/loading.tsx`
- Create: `app/error.tsx`
- Create: `app/global-error.tsx`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Test: `tests/lib/api/divulgador.test.ts`

- [ ] **Step 1: Install the existing dependencies from the lockfile**

Run: `pnpm install`
Expected: current scaffold dependencies install successfully.

- [ ] **Step 2: Read the relevant Next.js 16 docs from the installed package**

Inspect the topics in `node_modules/next/dist/docs/` related to:
- App Router async request APIs
- file conventions
- error boundaries
- image handling
- cache components

Expected: implementation notes recorded before any feature code is written.

- [ ] **Step 3: Write a failing smoke test for the future API module**

Create `tests/lib/api/divulgador.test.ts` with an import from `lib/api/divulgador.ts`.
Expected: the test file exists and references the future API contract.

- [ ] **Step 4: Run the smoke test to verify the red state**

Run: `pnpm vitest run tests/lib/api/divulgador.test.ts`
Expected: FAIL because Vitest config or the API module does not exist yet.

- [ ] **Step 5: Add the missing test dependencies and scripts**

Run: `pnpm add -D vitest jsdom @vitest/coverage-v8 @vitejs/plugin-react`
Expected: test tooling installs successfully.

- [ ] **Step 6: Wire the project configuration around the existing scaffold**

Implement:
- `test` and `test:watch` scripts in `package.json`
- `vitest.config.ts`
- `vitest.setup.ts`
- `app/loading.tsx`
- `app/error.tsx` as a client component with `reset()`
- `app/global-error.tsx` as a client component with `<html>` and `<body>`
- updated metadata and non-starter defaults in `app/layout.tsx`
- `next.config.ts` updates for:
  - `cacheComponents: true`
  - `images.remotePatterns` for the observed product image hosts
- letting Next regenerate `next-env.d.ts` through its normal build/dev flow rather than hand-authoring it

- [ ] **Step 7: Re-run the same smoke test**

Run: `pnpm vitest run tests/lib/api/divulgador.test.ts`
Expected: FAIL because `lib/api/divulgador.ts` exports are still missing, not because the test runner is missing.

- [ ] **Step 8: Run baseline verification on the starter after config changes**

Run:
```bash
pnpm lint
pnpm build
```
Expected: both commands succeed on the scaffold after the configuration work, or fail only for the next intentionally missing application modules.

- [ ] **Step 9: Commit the aligned foundation**

Run:
```bash
git add package.json next.config.ts app/layout.tsx app/globals.css app/loading.tsx app/error.tsx app/global-error.tsx eslint.config.mjs vitest.config.ts vitest.setup.ts tests/lib/api/divulgador.test.ts
git commit -m "chore: align next starter for storefront work"
```

### Task 2: Build Cache-Aware Server Data Helpers And Normalizers

**Files:**
- Create: `lib/types/divulgador.ts`
- Create: `lib/api/normalizers.ts`
- Create: `lib/api/divulgador.ts`
- Create: `lib/utils/currency.ts`
- Test: `tests/lib/api/divulgador.test.ts`

- [ ] **Step 1: Extend the failing API tests with real normalization scenarios**

Cover:
- nested product payload maps into a plain serializable product model
- nested coupon payload maps into a plain serializable coupon model
- price strings are converted into numeric subtotal-safe values
- coupon-filtered requests build query strings safely

- [ ] **Step 2: Run the API test file**

Run: `pnpm vitest run tests/lib/api/divulgador.test.ts`
Expected: FAIL with missing exports or unmet assertions.

- [ ] **Step 3: Implement the normalized domain types**

Create plain object types such as:
- `Product`
- `Coupon`
- `StorefrontData`

The client side must not receive raw `attributes` objects.

- [ ] **Step 4: Implement the normalizers and currency parsing helpers**

Normalize:
- `title`
- `image`
- `price`
- `price_from`
- `seller`
- `coupon`
- `installment`
- `discount`

Also derive:
- `priceLabel`
- `priceValue`
- `priceFromLabel`
- `couponCode`

- [ ] **Step 5: Implement the server data helpers**

Create helpers such as:
- `getProducts()`
- `getCoupons()`
- `getProductsByCoupon({ coupon, seller })`

Use:
- server-side fetches only
- `'use cache'` where safe for public read data
- `cacheLife('minutes')` or equivalent short-lived profile for list data
- `cacheTag('products')` and `cacheTag('coupons')` where useful

- [ ] **Step 6: Re-run the API tests**

Run: `pnpm vitest run tests/lib/api/divulgador.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit the data layer**

Run:
```bash
git add lib/types/divulgador.ts lib/api/normalizers.ts lib/api/divulgador.ts lib/utils/currency.ts tests/lib/api/divulgador.test.ts
git commit -m "feat: add divulgador server data layer"
```

## Chunk 2: Server-First Storefront Experience

### Task 3: Replace The Starter Page With The Storefront Shell And Local Search

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/storefront/storefront-client.tsx`
- Create: `components/storefront/storefront-header.tsx`
- Create: `components/catalog/product-card.tsx`
- Create: `components/catalog/product-grid.tsx`
- Create: `components/catalog/search-box.tsx`
- Create: `components/shared/empty-state.tsx`
- Create: `components/shared/status-banner.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Write the failing UI tests for the storefront client shell**

Cover:
- initial products render from server-provided props
- search narrows the visible products by title
- an empty search result renders a clear empty state

- [ ] **Step 2: Run the storefront UI tests**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: FAIL because the storefront modules do not exist yet.

- [ ] **Step 3: Replace the starter branding in the root layout**

Update:
- metadata title and description
- page chrome and semantic structure
- font usage so it follows `next/font` output instead of reverting to bare `Arial`

Keep `app/layout.tsx` as a Server Component.

- [ ] **Step 4: Implement the server page contract**

In `app/page.tsx`:
- type `searchParams` as a `Promise`
- await `searchParams`
- read optional `coupon`
- start the independent fetches in parallel
- pass only the fields the client subtree actually needs
- pass the current selected coupon as a serializable prop instead of making the client subtree read it from `useSearchParams()`

Do not pass raw fetch responses, functions, `Date`, `Map`, or other non-serializable props into client components.

- [ ] **Step 5: Implement the client storefront coordinator**

Create `components/storefront/storefront-client.tsx` as a client component that owns:
- search query state
- derived filtered list for the current product collection
- local display state for empty and loading placeholders

This file must be a synchronous `'use client'` component, not an async component.
The visible list must be derived during render, not mirrored into `useEffect` state.

- [ ] **Step 6: Implement the visual shell**

Build:
- `StorefrontHeader`
- `ProductGrid`
- `ProductCard`
- `SearchBox`
- shared empty/error display components

Use `next/image` for product imagery and provide graceful fallback UI if an item lacks an image. Remote product images must use explicit dimensions or `fill` plus a real `sizes` value, and only the actual above-the-fold hero/LCP image should use `priority`.

- [ ] **Step 7: Re-run the storefront UI tests**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit the storefront shell**

Run:
```bash
git add app/page.tsx app/layout.tsx app/globals.css components/storefront components/catalog components/shared tests/components/storefront-client.test.tsx
git commit -m "feat: add storefront shell and local search"
```

### Task 4: Add URL-Driven Coupon Filtering Without Client-Side Third-Party Reads

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/storefront/storefront-client.tsx`
- Create: `components/coupons/coupon-list.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Extend the storefront tests for coupon behavior**

Cover:
- coupon list renders available coupons
- selected coupon is highlighted
- applying a coupon updates the current product collection contract
- clearing the coupon restores the base catalog state

- [ ] **Step 2: Run the storefront UI test file**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: FAIL on coupon assertions.

- [ ] **Step 3: Implement the coupon list component**

Render coupon cards or pills with:
- code
- seller
- discount
- selected state

- [ ] **Step 4: Drive coupon filtering through the URL**

In the client coordinator:
- use `useRouter()`
- use `usePathname()`
- update `?coupon=` with `router.replace(...)`
- wrap the navigation in `startTransition(...)`

This keeps reads on the server path and avoids the browser calling the third-party API directly. Do not add `useSearchParams()` here unless it is isolated behind a dedicated Suspense boundary for a real need.

- [ ] **Step 5: Update the server page to honor coupon search params**

When `coupon` is present:
- fetch coupon-filtered products on the server
- still fetch coupons in parallel
- return a coherent empty state if no products match

- [ ] **Step 6: Re-run the storefront UI tests**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit the coupon flow**

Run:
```bash
git add app/page.tsx components/storefront/storefront-client.tsx components/coupons/coupon-list.tsx tests/components/storefront-client.test.tsx
git commit -m "feat: add url-driven coupon filtering"
```

## Chunk 3: Local Cart And Interactive State

### Task 5: Add A Dedicated Client Cart Provider And Cart UI

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/catalog/product-card.tsx`
- Create: `components/providers/cart-provider.tsx`
- Create: `components/cart/cart-panel.tsx`
- Create: `components/cart/cart-item.tsx`
- Create: `lib/cart/cart-reducer.ts`
- Test: `tests/lib/cart/cart-reducer.test.ts`
- Test: `tests/components/cart-panel.test.tsx`

- [ ] **Step 1: Write the failing reducer tests**

Cover:
- adding a product creates a line item
- adding the same product increments quantity
- decrementing to zero removes the item
- subtotal is derived correctly from numeric prices

- [ ] **Step 2: Run the reducer tests**

Run: `pnpm vitest run tests/lib/cart/cart-reducer.test.ts`
Expected: FAIL because the reducer does not exist yet.

- [ ] **Step 3: Implement the cart reducer**

Keep the business logic pure and framework-agnostic in `lib/cart/cart-reducer.ts`.

- [ ] **Step 4: Write the failing cart panel tests**

Cover:
- clicking the product CTA adds an item to the cart
- the cart panel renders items and subtotal
- increment, decrement, and remove update the summary correctly

- [ ] **Step 5: Run the cart panel tests**

Run: `pnpm vitest run tests/components/cart-panel.test.tsx`
Expected: FAIL because the provider or cart components do not exist yet.

- [ ] **Step 6: Implement the dedicated client provider**

Create `components/providers/cart-provider.tsx` as the client boundary for cart state and import it into `app/layout.tsx`.

Do not convert the entire root layout into a client component. The layout should remain server-rendered and wrap children with the client provider.

- [ ] **Step 7: Implement the cart UI**

Create:
- `CartPanel`
- `CartItem`

Use derived subtotal calculations during render instead of storing subtotal in separate state.

- [ ] **Step 8: Re-run the cart tests**

Run:
```bash
pnpm vitest run tests/lib/cart/cart-reducer.test.ts
pnpm vitest run tests/components/cart-panel.test.tsx
```
Expected: PASS.

- [ ] **Step 9: Commit the cart flow**

Run:
```bash
git add app/layout.tsx components/providers/cart-provider.tsx components/cart components/catalog/product-card.tsx lib/cart/cart-reducer.ts tests/lib/cart/cart-reducer.test.ts tests/components/cart-panel.test.tsx
git commit -m "feat: add local cart experience"
```

## Chunk 4: Hardening, Documentation, And Delivery

### Task 6: Final Verification, README Creation, And Submission Prep

**Files:**
- Create: `README.md`
- Modify: any touched source file for final fixes

- [ ] **Step 1: Run the full automated verification suite**

Run:
```bash
pnpm lint
pnpm test
pnpm build
```
Expected: all commands exit with code `0`.

- [ ] **Step 2: Execute manual QA against the acceptance checklist**

Verify:
- products load on first visit
- search filters by title
- coupons render and can be applied
- coupon selection updates the URL and product collection correctly
- adding, incrementing, decrementing, and removing cart items updates totals correctly
- mobile and desktop layouts remain readable
- loading, empty, and error states are comprehensible

- [ ] **Step 3: Create the project README**

Document:
- purpose of the challenge
- setup commands
- available scripts
- stack choices
- architecture summary
- feature checklist
- known trade-offs

- [ ] **Step 4: Fix any issues found in QA and re-run verification**

Repeat:
```bash
pnpm lint
pnpm test
pnpm build
```
Expected: all commands remain green after final fixes.

- [ ] **Step 5: Commit the submission-ready state**

Run:
```bash
git add README.md app components lib tests package.json pnpm-lock.yaml next.config.ts
git commit -m "docs: finalize technical test delivery"
```

## Delivery Notes

- Build on top of the existing scaffold instead of replacing it wholesale.
- Prefer server-side reads in `app/page.tsx`; avoid introducing Route Handlers unless a real client-only read becomes unavoidable.
- Keep coupon filtering URL-driven so the server remains the source of truth for filtered results.
- Keep the root layout server-rendered and isolate cart interactivity in a child client provider.
- Use `next/image` with configured remote patterns rather than falling back to raw `<img>` tags.
- Use cache components conservatively: short-lived caching is appropriate for public catalog reads, but do not cache anything that should be per-request or user-specific.
- Do not add checkout, auth, persistence backend, dashboards, or unrelated product features.
