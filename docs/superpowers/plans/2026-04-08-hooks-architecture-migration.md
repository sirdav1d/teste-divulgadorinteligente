# Hooks Architecture Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move custom hook logic out of component files and into the root `/hooks` directory, even when the hook is only used by a single component.

**Architecture:** Keep the rendering components thin and extract stateful React hook logic into domain-scoped hook files under `/hooks`. This change is structural, so the main risks are breaking existing UI behavior or leaving architectural regressions unguarded; both are handled with targeted tests and a stricter architecture test.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Hooks Boundary In Tests

**Files:**
- Modify: `tests/architecture/helpers-architecture.test.ts`

- [ ] **Step 1: Write the failing architecture test**

Add assertions that:
- `hooks/` exists and contains the extracted hooks for `storefront`, `catalog`, and `app`
- `components/storefront/storefront-catalog-client.tsx` no longer defines catalog request/state helpers inline
- `components/storefront/storefront-experience.tsx` no longer contains cart-state and hero-visibility hook logic inline
- `components/catalog/command-filter.tsx` no longer owns the focus/open/container hook logic inline
- `app/error.tsx` no longer owns the error-reporting effect inline

- [ ] **Step 2: Run the architecture test to verify it fails**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts
```

Expected: FAIL because the hook files and architectural assertions are not satisfied yet.

### Task 2: Extract Storefront Hooks

**Files:**
- Create: `hooks/storefront/use-storefront-catalog.ts`
- Create: `hooks/storefront/use-cart.ts`
- Create: `hooks/storefront/use-hero-visibility.ts`
- Modify: `components/storefront/storefront-catalog-client.tsx`
- Modify: `components/storefront/storefront-experience.tsx`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Run the storefront integration test suite as the red baseline**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS before refactor, establishing the safety net.

- [ ] **Step 2: Extract the storefront hooks with minimal surface changes**

Move:
- remote catalog state, refresh/load-more handlers, and filter URL sync into `use-storefront-catalog.ts`
- cart line state and derived counts into `use-cart.ts`
- hero `IntersectionObserver` state and ref into `use-hero-visibility.ts`

Keep component props and rendered output stable.

- [ ] **Step 3: Re-run the storefront integration test suite**

Run:

```bash
pnpm vitest run tests/components/storefront-client.test.tsx
```

Expected: PASS.

### Task 3: Extract Catalog And App Hooks

**Files:**
- Create: `hooks/catalog/use-command-filter.ts`
- Create: `hooks/app/use-log-error.ts`
- Modify: `components/catalog/command-filter.tsx`
- Modify: `app/error.tsx`
- Test: `tests/app/route-states.test.tsx`

- [ ] **Step 1: Run the route-state test suite as the red baseline**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx
```

Expected: PASS before refactor, establishing the safety net.

- [ ] **Step 2: Extract the minimal custom hooks**

Move:
- command-filter popover/open/focus/container state into `use-command-filter.ts`
- error logging side effect into `use-log-error.ts`

- [ ] **Step 3: Re-run the route-state test suite and architecture test**

Run:

```bash
pnpm vitest run tests/app/route-states.test.tsx tests/architecture/helpers-architecture.test.ts
```

Expected: PASS.

### Task 4: Final Verification

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run TypeScript verification**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 2: Run the focused test suite**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/components/storefront-client.test.tsx tests/app/route-states.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run focused ESLint**

Run:

```bash
pnpm eslint app/error.tsx components/storefront/storefront-catalog-client.tsx components/storefront/storefront-experience.tsx components/catalog/command-filter.tsx hooks/app/use-log-error.ts hooks/catalog/use-command-filter.ts hooks/storefront/use-storefront-catalog.ts hooks/storefront/use-cart.ts hooks/storefront/use-hero-visibility.ts tests/architecture/helpers-architecture.test.ts tests/components/storefront-client.test.tsx tests/app/route-states.test.tsx
```

Expected: no lint errors.
