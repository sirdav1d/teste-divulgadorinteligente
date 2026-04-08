# Remote Catalog Pagination Design

Date: 2026-04-08

## Goal

Replace the current frontend-only "load more" behavior with real remote pagination, while preserving search and category filtering over the full remote catalog.

## Problem

Today the app fetches only the first 20 products from the external API and the `Ver mais` button only reveals more items from that already-loaded array.

This creates two limits:

- users can never access products beyond the first 20
- search and category filtering only operate on the currently loaded in-memory dataset

The product API supports pagination and category filtering, but direct server-side search support could not be verified. That means the app must own search pagination if search needs to cover the full remote catalog.

## Decision

Implement a server-side catalog layer owned by the app.

This layer will:

- paginate the external API using `start` and `limit`
- pass through `coupon` and `category` when applicable
- apply name search on the server when needed
- return page metadata the frontend can use for real incremental loading

## Catalog Contract

Introduce a paginated catalog result:

```ts
type CatalogPageResult = {
  products: Product[];
  nextOffset: number | null;
  hasMore: boolean;
};
```

Input shape:

```ts
type CatalogPageOptions = {
  coupon?: string | null;
  category?: string | null;
  search?: string | null;
  offset?: number;
  pageSize?: number;
};
```

## Behavior Rules

### Without Search

When `search` is empty:

- request one external page using `start=offset`
- request `limit=pageSize`
- apply `coupon` and `category` remotely where supported
- return normalized products plus:
  - `hasMore = payload length === pageSize`
  - `nextOffset = offset + payload length` when `hasMore`, otherwise `null`

### With Search

When `search` is present:

- page through the external API in chunks of 20
- apply remote filters that the API supports (`coupon`, `category`)
- filter each fetched chunk locally by product title
- keep accumulating matches until:
  - `pageSize` matches are collected, or
  - the remote API is exhausted

`nextOffset` should represent the next remote offset to continue scanning from, not the number of matched items already returned.

This ensures search operates on the full remote catalog instead of only the first fetched page.

## Frontend State Model

The storefront catalog client should stop using `visibleCount` slicing.

Replace it with page-oriented state:

- `loadedProducts`
- `nextOffset`
- `hasMore`
- `isLoadingMore`

Rules:

- initial page comes from the server-rendered route
- clicking `Ver mais` requests the next page with the same active filters
- changing search, category, or coupon resets pagination and reloads from the first page

## Integration Points

### Data Layer

The current Divulgador API module should be expanded to support paginated product fetches by `start` and `limit`.

An app-owned catalog function should orchestrate:

- direct remote pagination when no search is active
- remote scan plus local title filtering when search is active

### Page Load

`app/page.tsx` should fetch the first catalog page, not just a flat `products[]`.

### Client Catalog

The storefront catalog client should consume:

- initial `products`
- `nextOffset`
- `hasMore`

and use those values to request more data.

## Testing Strategy

Add or update tests for:

- paginated fetch behavior in the data layer
- remote category/coupon pagination behavior
- search pagination that scans beyond the first external page
- storefront integration where `Ver mais` appends a new remote page instead of just increasing a slice

## Risks

### Search cost

When search is active, the app may need to scan multiple external pages to collect enough results. The implementation should stay bounded and predictable.

### Filter resets

Search, category, and coupon changes must fully reset pagination state so stale pages are not mixed across filter contexts.

### Cursor correctness

`nextOffset` must track remote scan progress correctly, especially in the search path.

## Acceptance Criteria

- `Ver mais` loads products beyond the first 20 from the external API
- category filtering continues to apply to the full remote catalog
- search by name continues to apply to the full remote catalog
- loaded pages accumulate correctly in the storefront
- changing active filters resets pagination cleanly
- tests cover data-layer pagination and storefront integration behavior
