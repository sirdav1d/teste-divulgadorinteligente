# Catalog Review Follow-ups Design

Date: 2026-04-08

## Goal

Resolve two architectural issues in the storefront catalog:

- remove the duplicate refresh path created by `router.replace` plus `/api/catalog`
- make category options reflect the full remote catalog filtered only by the active coupon

The app should continue using native HTML `<img>` tags.

## Current Problems

### Duplicate Data Refresh

Today the client catalog hook updates the URL with `router.replace(...)` and also fetches `/api/catalog` directly.

That creates two refresh paths for the same filter change:

- App Router navigation re-runs `app/page.tsx`
- client code separately fetches `/api/catalog`

This duplicates work and splits the catalog state across two independent sources.

### Incomplete Category Options

Today category options are derived from products already loaded in the client.

That means categories only become selectable after the user has already paged far enough to encounter them. This does not satisfy the requirement that category filtering applies to the full remote catalog.

## Decision

Keep the first-page server render for direct entry and sharing, but make the client own subsequent catalog refreshes.

Concretely:

- `app/page.tsx` still loads the initial catalog page
- the client syncs the URL using `window.history.replaceState`, not `router.replace`
- catalog refreshes after hydration use only `/api/catalog`
- category options are fetched from the server and represent the full remote catalog for the active coupon
- search does not affect the category option list

## User-Facing Behavior

### Search, Category, Coupon

After hydration:

- typing in search updates the URL and refreshes the catalog through `/api/catalog`
- changing category updates the URL and refreshes the catalog through `/api/catalog`
- changing coupon updates the URL and refreshes both the catalog page and the category options through `/api/catalog`

There should be only one catalog refresh per user action.

### Category Options

The category filter should show all categories available in the remote catalog under the currently active coupon context.

Rules:

- with no coupon selected, show categories from the full remote catalog
- with a coupon selected, show categories from the full remote catalog restricted to that coupon
- search text does not shrink or change the category list

## Data Contract Changes

Extend the catalog payload so the server can return category options alongside product pagination.

Proposed shape:

```ts
type CatalogResponse = {
  products: Product[];
  hasMore: boolean;
  nextOffset: number | null;
  availableCategories: CategoryOption[];
};
```

Behavior:

- initial page response includes `availableCategories`
- load-more responses may omit category recalculation or may reuse the same shape with identical categories
- first-page refreshes triggered by search/category/coupon should return the fresh `availableCategories`

## Server Responsibilities

### Product Pagination

The existing server catalog logic remains responsible for:

- remote pagination
- remote coupon filtering
- remote category filtering where supported
- app-owned text search across remote pages

### Category Discovery

Add a server-side category discovery function that:

- scans the remote catalog
- applies only the active coupon constraint
- counts and formats category options for the full remote dataset

This function should not depend on the current client-loaded product pages.

## Client Responsibilities

### URL Sync

Use native `window.history.replaceState` to update the URL without triggering an App Router data refresh.

This preserves:

- the visible query string
- back/forward semantics for the current history entry
- a single client-owned fetch path after hydration

### Catalog State

The client catalog hook should:

- keep `loadedProducts`, `nextOffset`, `hasMoreProducts`
- refresh first-page data from `/api/catalog`
- update `availableCategories` from the response
- append more products on `Ver mais`

## Files Expected To Change

- `lib/divulgador.ts`
- `app/page.tsx`
- `app/api/catalog/route.ts`
- `hooks/storefront/use-storefront-catalog.ts`
- `components/storefront/storefront-client.tsx`
- `components/storefront/storefront-experience.tsx`
- tests covering data layer, route handler, and storefront integration

## Acceptance Criteria

- search/category/coupon changes trigger only one catalog refresh path
- the client no longer uses `router.replace` for catalog filter synchronization
- category options are sourced from the full remote catalog
- category options depend on coupon, but not on search
- `Ver mais` still appends the next remote page correctly
- native `<img>` usage remains unchanged
