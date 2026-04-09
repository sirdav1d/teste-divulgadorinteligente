# Home Bootstrap Loading Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium bootstrap-only loading experience for the home hard reload path, with the current logo, blue background, copy, and a client-driven progress bar that reaches `100%` before revealing the existing home UI.

**Architecture:** Replace `app/loading.tsx` as the home loading mechanism with a pre-hydration document flag plus a dedicated client bootstrap overlay mounted inside the storefront experience. The root layout only sets and clears a temporary document state to prevent the initial white flash; the overlay owns progress, exit timing, and cleanup while keeping the underlying page server-first and visually unchanged once loading ends.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript, Vitest, ESLint

---

## File Map

- **Create:** `helpers/storefront/home-bootstrap-loading.ts`
  - Pure constants and logic for deciding whether the home bootstrap loading should run.
  - Builds the pre-hydration script string used by the root layout.
- **Create:** `hooks/storefront/use-home-bootstrap-progress.ts`
  - Owns bootstrap progress milestones, minimum visible duration, exit timing, and document cleanup.
- **Create:** `components/storefront/storefront-initial-bootstrap.tsx`
  - Renders the full-screen overlay, current logo, copy, progress bar, and exit transition.
- **Modify:** `app/layout.tsx`
  - Injects the early bootstrap script and temporary document-state wiring.
- **Delete:** `app/loading.tsx`
  - Removes route-segment fallback loading as the home loading mechanism.
- **Modify:** `app/globals.css`
  - Adds the temporary anti-flash document rule keyed off the bootstrap attribute.
- **Modify:** `components/storefront/storefront-experience.tsx`
  - Mounts the bootstrap overlay around the existing home experience and exposes a stable bootstrap root marker.
- **Create:** `tests/helpers/storefront/home-bootstrap-loading.test.ts`
  - Covers hard-reload gating and script generation as pure behavior.
- **Modify:** `tests/components/storefront-client.test.tsx`
  - Covers the bootstrap overlay showing only for the flagged reload case, disappearing after bootstrap, and staying absent during catalog interactions.
- **Modify:** `tests/architecture/encoding-hygiene.test.ts`
  - Removes the deleted `app/loading.tsx` path and adds any new critical text-bearing files introduced by the feature.

## Implementation Notes

- Follow `@next-best-practices` and the local Next.js docs for `loading.tsx`, layout wiring, and pre-hydration behavior.
- Follow `@test-driven-development`: every behavior change starts with a failing test.
- Follow `@frontend-design`: the overlay should feel intentional and premium, but it must not alter the final home visual language after dismissal.
- Follow `@verification-before-completion`: do not claim success without rerunning the full verification baseline.

## Chunk 1: Bootstrap Gating Contract

### Task 1: Add the pure bootstrap-gating tests

**Files:**
- Create: `tests/helpers/storefront/home-bootstrap-loading.test.ts`
- Reference: `docs/superpowers/specs/2026-04-09-home-bootstrap-loading-design.md`

- [ ] **Step 1: Write the failing test for hard-reload gating**

```ts
import { describe, expect, it } from 'vitest';

import {
	HOME_BOOTSTRAP_LOADING_ATTRIBUTE,
	shouldEnableHomeBootstrapLoading,
} from '../../../helpers/storefront/home-bootstrap-loading';

describe('home bootstrap loading helper', () => {
	it('only enables the bootstrap overlay for home hard reloads', () => {
		expect(shouldEnableHomeBootstrapLoading('/', 'reload')).toBe(true);
		expect(shouldEnableHomeBootstrapLoading('/', 'navigate')).toBe(false);
		expect(shouldEnableHomeBootstrapLoading('/', 'back_forward')).toBe(false);
		expect(shouldEnableHomeBootstrapLoading('/ofertas', 'reload')).toBe(false);
		expect(HOME_BOOTSTRAP_LOADING_ATTRIBUTE).toBe('data-home-bootstrap-loading');
	});
});
```

- [ ] **Step 2: Run the helper test to verify it fails**

Run: `pnpm vitest run tests/helpers/storefront/home-bootstrap-loading.test.ts`

Expected: FAIL because `helpers/storefront/home-bootstrap-loading.ts` does not exist yet.

- [ ] **Step 3: Add the failing test for script generation**

```ts
import { buildHomeBootstrapLoadingScript } from '../../../helpers/storefront/home-bootstrap-loading';

it('builds a pre-hydration script that toggles the document attribute only for hard reloads of the home pathname', () => {
	const script = buildHomeBootstrapLoadingScript();

	expect(script).toContain("performance.getEntriesByType('navigation')");
	expect(script).toContain("window.location.pathname === '/'");
	expect(script).toContain(HOME_BOOTSTRAP_LOADING_ATTRIBUTE);
});
```

- [ ] **Step 4: Run the helper test again to verify the second assertion also fails**

Run: `pnpm vitest run tests/helpers/storefront/home-bootstrap-loading.test.ts`

Expected: FAIL with missing exports or missing module errors.

- [ ] **Step 5: Commit the red test state if working in an isolated task branch**

```bash
git add tests/helpers/storefront/home-bootstrap-loading.test.ts
git commit -m "test: define home bootstrap loading contract"
```

### Task 2: Implement the pure bootstrap-gating helper

**Files:**
- Create: `helpers/storefront/home-bootstrap-loading.ts`
- Test: `tests/helpers/storefront/home-bootstrap-loading.test.ts`

- [ ] **Step 1: Implement the minimal helper exports**

```ts
export const HOME_BOOTSTRAP_LOADING_ATTRIBUTE = 'data-home-bootstrap-loading';

export function shouldEnableHomeBootstrapLoading(
	pathname: string,
	navigationType: string | null,
) {
	return pathname === '/' && navigationType === 'reload';
}

export function buildHomeBootstrapLoadingScript() {
	return `(() => {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const navigationType = navigationEntry && 'type' in navigationEntry
      ? String(navigationEntry.type)
      : null;
    if (${shouldEnableHomeBootstrapLoading.name}.toString) {}
  } catch {}
})();`;
}
```

Replace the placeholder body with a static inline script string that:

- reads `window.location.pathname`
- reads `performance.getEntriesByType('navigation')[0]?.type`
- sets `document.documentElement.setAttribute(HOME_BOOTSTRAP_LOADING_ATTRIBUTE, 'true')` only for `/` + `reload`

- [ ] **Step 2: Keep the helper pure**

Do not import React, Next.js APIs, or browser globals at module evaluation time. The only browser references should live inside the generated script string.

- [ ] **Step 3: Run the helper test to verify it passes**

Run: `pnpm vitest run tests/helpers/storefront/home-bootstrap-loading.test.ts`

Expected: PASS

- [ ] **Step 4: Review the helper for DRY/YAGNI**

Keep only:

- the attribute constant
- the pure predicate
- the script builder

Do not add session persistence, navigation listeners, or extra bootstrap states.

- [ ] **Step 5: Commit**

```bash
git add helpers/storefront/home-bootstrap-loading.ts tests/helpers/storefront/home-bootstrap-loading.test.ts
git commit -m "feat: add home bootstrap loading helper"
```

## Chunk 2: Overlay Behavior and Integration

### Task 3: Add the failing storefront integration tests

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Reference: `components/storefront/storefront-experience.tsx`
- Reference: `docs/superpowers/specs/2026-04-09-home-bootstrap-loading-design.md`

- [ ] **Step 1: Add a failing test for the flagged hard-reload case**

Append a test near the top of the suite:

```ts
it('shows the bootstrap overlay only when the document is flagged for initial home loading', async () => {
	vi.useFakeTimers();
	document.documentElement.setAttribute('data-home-bootstrap-loading', 'true');

	const view = renderStorefront();

	expect(document.body.textContent).toContain('Preparando sua vitrine inteligente.');
	expect(document.body.textContent).toContain('0%');

	await act(async () => {
		vi.advanceTimersByTime(600);
		await flushAsyncWork(6);
	});

	expect(document.body.textContent).not.toContain('Preparando sua vitrine inteligente.');
	expect(document.documentElement.hasAttribute('data-home-bootstrap-loading')).toBe(false);
	expect(view.container.textContent).toContain('Cupons');

	view.cleanup();
	vi.useRealTimers();
});
```

- [ ] **Step 2: Add a failing test for the default non-reload case**

```ts
it('does not mount the bootstrap overlay when the document is not flagged', () => {
	const view = renderStorefront();

	expect(document.body.textContent).not.toContain('Preparando sua vitrine inteligente.');
	expect(view.container.textContent).toContain('Panela');

	view.cleanup();
});
```

- [ ] **Step 3: Add a failing test proving catalog interactions do not reactivate the overlay**

```ts
it('does not reactivate the bootstrap overlay during catalog interactions', async () => {
	const view = renderStorefront();
	const input = view.container.querySelector("input[name='search']");

	expect(input).not.toBeNull();

	await act(async () => {
		Object.assign(input!, { value: 'Notebook' });
		input!.dispatchEvent(new Event('input', { bubbles: true }));
		await flushAsyncWork();
	});

	expect(document.body.textContent).not.toContain('Preparando sua vitrine inteligente.');
	expect(view.container.textContent).toContain('Notebook gamer Nitro 5');

	view.cleanup();
});
```

- [ ] **Step 4: Run the storefront integration test file to verify the new tests fail**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: FAIL because there is no bootstrap overlay or cleanup behavior yet.

- [ ] **Step 5: Commit the red test state if working in an isolated task branch**

```bash
git add tests/components/storefront-client.test.tsx
git commit -m "test: define home bootstrap overlay behavior"
```

### Task 4: Implement the overlay hook and component

**Files:**
- Create: `hooks/storefront/use-home-bootstrap-progress.ts`
- Create: `components/storefront/storefront-initial-bootstrap.tsx`
- Modify: `components/storefront/storefront-experience.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Implement the bootstrap hook**

Use a focused client hook that:

- checks `document.documentElement.hasAttribute(HOME_BOOTSTRAP_LOADING_ATTRIBUTE)` on mount
- returns early with `isVisible: false` when the attribute is absent
- drives a progress state through milestone caps
- waits for a minimum visible duration
- uses `requestAnimationFrame` for the final paint settle
- removes the document attribute once the exit transition finishes

Minimal shape:

```ts
type HomeBootstrapState = {
	isVisible: boolean;
	isExiting: boolean;
	progress: number;
	label: string;
};

export function useHomeBootstrapProgress() {
	// mount gate
	// progress milestones
	// min duration
	// exit + document cleanup
}
```

- [ ] **Step 2: Implement the overlay component**

Render a client component with:

- full-screen fixed positioning
- blue `brand-primary` background
- current `/brand/divulgador-inteligente-logo.svg` logo
- copy: `Preparando sua vitrine inteligente.`
- progress bar with percentage text
- short exit transition after `100%`

Minimal structure:

```tsx
export default function StorefrontInitialBootstrap() {
	const { isVisible, isExiting, progress, label } = useHomeBootstrapProgress();

	if (!isVisible) return null;

	return (
		<div role="status" aria-live="polite" aria-label="Carregamento inicial da home">
			<img src="/brand/divulgador-inteligente-logo.svg" alt="Divulgador Inteligente" />
			<p>{label}</p>
			<div aria-hidden="true">
				<div style={{ width: `${progress}%` }} />
			</div>
			<span>{progress}%</span>
		</div>
	);
}
```

Keep the native `<img>` policy intact.

- [ ] **Step 3: Mount the overlay in the storefront experience without promoting the whole tree unnecessarily**

Update `components/storefront/storefront-experience.tsx` so the server-rendered home stays intact and the client overlay sits above it:

```tsx
import StorefrontInitialBootstrap from './storefront-initial-bootstrap';

export default function StorefrontExperience(...) {
	return (
		<>
			<StorefrontInitialBootstrap />
			<main data-home-bootstrap-root="true" className="relative min-h-screen">
				...
			</main>
		</>
	);
}
```

Do not move catalog fetching or server orchestration into the client.

- [ ] **Step 4: Add the temporary anti-flash document rule**

In `app/globals.css`, add only the minimum global rule needed:

```css
html[data-home-bootstrap-loading='true'],
html[data-home-bootstrap-loading='true'] body {
	background-color: var(--brand-primary);
}
```

Do not change the default home background tokens or permanent body styling.

- [ ] **Step 5: Run the storefront integration test file to verify the new behavior passes**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add hooks/storefront/use-home-bootstrap-progress.ts components/storefront/storefront-initial-bootstrap.tsx components/storefront/storefront-experience.tsx app/globals.css tests/components/storefront-client.test.tsx
git commit -m "feat: add home bootstrap overlay"
```

### Task 5: Wire the root layout and remove `app/loading.tsx`

**Files:**
- Modify: `app/layout.tsx`
- Delete: `app/loading.tsx`
- Modify: `tests/architecture/encoding-hygiene.test.ts`
- Test: `tests/helpers/storefront/home-bootstrap-loading.test.ts`
- Test: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Inject the pre-hydration script in the root layout**

Use the pure helper from `helpers/storefront/home-bootstrap-loading.ts` and wire it into `app/layout.tsx` with a minimal inline script:

```tsx
import Script from 'next/script';
import { buildHomeBootstrapLoadingScript } from '@/helpers/storefront/home-bootstrap-loading';

<Script
	id="home-bootstrap-loading"
	strategy="beforeInteractive"
	dangerouslySetInnerHTML={{ __html: buildHomeBootstrapLoadingScript() }}
/>
```

This keeps the anti-flash state route-aware without making the rest of the app permanently blue.

- [ ] **Step 2: Delete the segment loading file**

Remove `app/loading.tsx` entirely so the route-level fallback no longer competes with the bootstrap overlay.

- [ ] **Step 3: Update encoding hygiene coverage**

Replace the deleted path with the new critical text-bearing files:

- `helpers/storefront/home-bootstrap-loading.ts`
- `components/storefront/storefront-initial-bootstrap.tsx`
- `hooks/storefront/use-home-bootstrap-progress.ts`

If the new copy changes, keep the file UTF-8 clean.

- [ ] **Step 4: Run the focused tests after layout wiring**

Run:

```bash
pnpm vitest run tests/helpers/storefront/home-bootstrap-loading.test.ts tests/components/storefront-client.test.tsx tests/architecture/encoding-hygiene.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css tests/architecture/encoding-hygiene.test.ts
git rm app/loading.tsx
git commit -m "refactor: replace home loading fallback with bootstrap gate"
```

## Chunk 3: Final Verification

### Task 6: Run the full verification baseline

**Files:**
- Verify working tree changes from the previous tasks only

- [ ] **Step 1: Run the full test suite**

Run: `pnpm vitest run`

Expected: PASS with all test files green.

- [ ] **Step 2: Run lint**

Run: `pnpm eslint .`

Expected: PASS with no errors or warnings.

- [ ] **Step 3: Run type-check**

Run: `pnpm exec tsc --noEmit`

Expected: PASS

- [ ] **Step 4: Run production build**

Run: `pnpm build`

Expected:

- build succeeds
- `/` still shows `◐` Partial Prerender in the route summary
- `/api/catalog` remains dynamic

- [ ] **Step 5: Sanity-check the acceptance criteria against the finished branch**

Confirm manually:

- no white flash on hard reload of `/`
- blue full-screen bootstrap overlay appears on home reload
- overlay reaches `100%`
- overlay exits cleanly
- home visual underneath remains intact
- catalog interactions do not trigger the full-screen overlay

- [ ] **Step 6: Commit the final verified state**

```bash
git add -A
git commit -m "feat: add home bootstrap loading experience"
```

## Plan Review Notes

- Keep the client boundary narrow: the new client overlay should be a dedicated component, not a reason to convert more of the page tree to client code.
- Do not move data fetching out of `app/page.tsx` or `lib/divulgador/*`.
- Do not replace the current logo asset or migrate it to `next/image`.
- Do not introduce session persistence or replay logic; the approved scope is hard reload of the home only.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-09-home-bootstrap-loading.md`. Ready to execute?
