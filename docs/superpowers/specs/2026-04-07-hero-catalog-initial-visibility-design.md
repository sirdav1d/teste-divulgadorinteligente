# Hero Catalog Initial Visibility Design

## Goal

Keep the catalog search and filter bar fully out of view on the initial page load, and only let it appear after the user starts scrolling past the hero.

## Current Context

- The hero is rendered in `components/storefront/storefront-header.tsx`.
- The catalog sticky bar starts immediately after the hero in `components/storefront/storefront-catalog-client.tsx`.
- The hero currently uses `min-h-svh`, which can be shorter than the actually visible viewport on some browsers and window sizes.

## Recommended Approach

Switch the storefront hero containers from `min-h-svh` to `min-h-dvh`.

- Outer header wrapper: `min-h-dvh`
- Inner layout wrapper: `min-h-dvh`

This keeps the hero at least as tall as the visible viewport, so the catalog bar stays below the fold on first paint without changing the sticky behavior of the catalog itself.

## Acceptance Criteria

- On initial load, the catalog search/filter bar is not visible.
- After scrolling, the catalog bar appears and continues to behave as a sticky section.
- No extra spacer or JS-only visibility toggle is introduced for the catalog bar.
