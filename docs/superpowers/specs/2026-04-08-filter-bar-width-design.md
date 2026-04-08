# Filter Bar Width Design

## Goal

Make the storefront filter bar use the same horizontal container width as the product list below it.

## Current Context

- The storefront catalog shell already uses the page-width container in `components/storefront/storefront-catalog-client.tsx`.
- The filter row inside that shell is additionally capped by `max-w-6xl`.
- The product list below is not capped by that inner max width, so the filter bar appears visibly narrower.

## Recommended Approach

Remove the inner `max-w-6xl` constraint from the filter row and keep it at `w-full`.

This preserves the current filter composition and spacing while letting the whole filter section align with the same usable width as the list container.

## Acceptance Criteria

- The filter section spans the same horizontal container width as the product list.
- The current search/coupon/category layout remains intact.
- No unrelated spacing or sticky behavior changes are introduced.
