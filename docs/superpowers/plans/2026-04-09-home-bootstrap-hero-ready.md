# Home Bootstrap Hero Ready Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the home bootstrap overlay visible until the hero is actually ready to display, instead of closing on a fixed timer before the streamed home content arrives.

**Architecture:** Replace the timer-only completion logic with a two-phase gate: progress still advances on time-based milestones, but exit only starts after a stable `hero-ready` client signal. The hero media becomes the source of that signal, with a media-ready path and a defensive fallback so the loader cannot hang forever.

**Tech Stack:** Next.js 16 App Router, React 19, Motion, Vitest, Testing Library-style DOM assertions

---

### Task 1: Lock the regression with tests

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] Add a failing test proving the bootstrap overlay stays active after the existing timer window if the hero-ready signal was not emitted yet.
- [ ] Add a failing test proving the bootstrap overlay closes only after the hero-ready signal is emitted.
- [ ] Add a failing test proving the hero media emits the ready signal when the video becomes display-ready.
- [ ] Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

### Task 2: Move bootstrap completion to an explicit hero-ready contract

**Files:**
- Modify: `helpers/storefront/home-bootstrap-loading.ts`
- Modify: `hooks/storefront/use-home-bootstrap-progress.ts`

- [ ] Add a shared constant for the hero-ready event name.
- [ ] Refactor the bootstrap hook so time-based milestones stop at pre-completion progress.
- [ ] Wait for the hero-ready event before driving the final `100% -> exit -> hide` sequence.
- [ ] Preserve the existing hard-reload-only behavior and hydration-safe DOM contract.
- [ ] Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

### Task 3: Emit hero-ready from the hero media

**Files:**
- Modify: `components/storefront/storefront-hero-media.tsx`

- [ ] Add a guarded ready emitter that dispatches the shared hero-ready event exactly once.
- [ ] Trigger the event when the video has enough data to render its first frame.
- [ ] Add a short defensive fallback after mount so the bootstrap overlay cannot hang indefinitely if the media event never fires.
- [ ] Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

### Task 4: Verify the full slice

**Files:**
- Modify as needed based on verification fallout only

- [ ] Run: `pnpm vitest run tests/components/storefront-client.test.tsx`
- [ ] Run: `pnpm eslint helpers/storefront/home-bootstrap-loading.ts hooks/storefront/use-home-bootstrap-progress.ts components/storefront/storefront-hero-media.tsx tests/components/storefront-client.test.tsx`
- [ ] Run: `pnpm exec tsc --noEmit`
- [ ] Run: `pnpm build`
