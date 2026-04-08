# Root Types Architecture Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/types` the only home for shared application types and update the architecture test and imports to match that boundary.

**Architecture:** Keep the change narrow: update the architecture test so `lib/` only contains the API entrypoint, assert the shared type contract exists at the root `types/` directory, and normalize the remaining production import to `@/types/...`. This is structural only, so the main risk is leaving stale path assumptions behind.

**Tech Stack:** Next.js 16.2.2, TypeScript, Vitest, ESLint

---

### Task 1: Lock The Root Types Boundary In Tests

**Files:**
- Modify: `tests/architecture/helpers-architecture.test.ts`
- Modify later: `lib/api/divulgador.ts`

- [ ] **Step 1: Write the failing architecture test**

Update the architecture test to assert:
- `lib/` contains only `api/divulgador.ts`
- `types/divulgador.ts` exists at the repo root
- the active production source file `lib/api/divulgador.ts` imports types from `@/types/divulgador`
- no architecture assertions still expect `lib/types`

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts
```

Expected: FAIL because the architecture test still expects `types/divulgador.ts` under `lib` and `lib/api/divulgador.ts` still uses a relative import.

### Task 2: Update The Remaining Production Type Import

**Files:**
- Modify: `lib/api/divulgador.ts`

- [ ] **Step 1: Switch the type import to the root alias**

Replace the remaining relative shared-type import with `@/types/divulgador`.

- [ ] **Step 2: Re-run the architecture test**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts
```

Expected: PASS.

### Task 3: Final Verification

**Files:**
- Modify as needed: any files touched above

- [ ] **Step 1: Run TypeScript verification**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 2: Run the final targeted test suite**

Run:

```bash
pnpm vitest run tests/architecture/helpers-architecture.test.ts tests/lib/api/divulgador.test.ts
```

Expected: PASS.

- [ ] **Step 3: Run focused ESLint**

Run:

```bash
pnpm eslint lib/api/divulgador.ts tests/architecture/helpers-architecture.test.ts
```

Expected: no lint errors.
