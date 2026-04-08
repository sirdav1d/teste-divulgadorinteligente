# Helpers Architecture Migration Design

Date: 2026-04-08

## Goal

Move internal helper functions out of `lib/` and out of component-local files into a dedicated `helpers/` tree, while keeping `lib/` restricted to external integrations and shared type contracts.

## Motivation

The current `lib/` folder mixes three different responsibilities:

- external integration code
- shared type contracts
- internal application helper functions

This makes the architectural boundary unclear. The desired rule is:

- `lib/` is only for external integration and type contracts
- `helpers/` is the single home for internal helper functions
- component files should not keep private helper functions when they can live as explicit modules in `helpers/`

## Scope

This refactor is structural. It should not change user-facing behavior.

Included:

- moving helper modules currently under `lib/` into `helpers/`
- extracting helper functions currently defined inside components into `helpers/`
- updating all imports in `app/`, `components/`, `tests/`, and internal helper modules
- removing obsolete helper files from `lib/`

Not included:

- changes to business behavior
- changes to UI copy, layout, or API contracts
- moving type definitions out of `lib/types`
- moving the main API entrypoint out of `lib/api`

## Target Boundaries

### `lib/`

`lib/` should keep only:

- external integration modules
- shared type contracts used across the app

Final intended content:

```text
lib/
  api/
    divulgador.ts
  types/
    divulgador.ts
```

### `helpers/`

`helpers/` becomes the home for all internal utility logic, organized by domain:

```text
helpers/
  cart/
    line-pricing.ts
  currency/
    parse-currency-value.ts
  divulgador/
    build-url.ts
    normalizers.ts
  storefront/
    category-filters.ts
    coupon-filters.ts
    seller-label.ts
  ui/
    cn.ts
  url/
    read-single-search-param.ts
```

## File Moves

### From `lib/` to `helpers/`

- `lib/utils.ts` -> `helpers/ui/cn.ts`
- `lib/storefront/category-filters.ts` -> `helpers/storefront/category-filters.ts`
- `lib/storefront/coupon-filters.ts` -> `helpers/storefront/coupon-filters.ts`
- `lib/storefront/search-params.ts` -> `helpers/url/read-single-search-param.ts`
- `lib/utils/currency.ts` -> `helpers/currency/parse-currency-value.ts`
- `lib/api/normalizers.ts` -> `helpers/divulgador/normalizers.ts`

### Extracted from existing files

- helper `buildUrl` from `lib/api/divulgador.ts` -> `helpers/divulgador/build-url.ts`
- helper `getSellerLabel` from `components/catalog/product-card.tsx` and coupon logic -> `helpers/storefront/seller-label.ts`
- helpers `formatCurrency`, `formatTotal`, `hasNumericPrice`, `formatLineUnitPrice`, and `formatLineTotal` from `components/cart/cart-sheet.tsx` -> `helpers/cart/line-pricing.ts`

## Module Responsibilities

### `helpers/ui/cn.ts`

Contains the class-merging helper currently imported by multiple UI primitives and cart UI pieces. This remains a generic internal helper, but no longer lives under `lib/`.

### `helpers/storefront/category-filters.ts`

Keeps storefront category filtering and labeling:

- category constants
- category option building
- category label formatting
- product filtering by search + category

### `helpers/storefront/coupon-filters.ts`

Keeps coupon option building and delegates seller display names to `helpers/storefront/seller-label.ts`.

### `helpers/storefront/seller-label.ts`

Becomes the single place for seller label normalization used by both coupon and product presentation.

### `helpers/url/read-single-search-param.ts`

Keeps lightweight app-side search param normalization.

### `helpers/currency/parse-currency-value.ts`

Keeps parsing of localized BRL strings into numeric values.

### `helpers/divulgador/normalizers.ts`

Keeps response normalization from raw Divulgador payloads into internal `Product` and `Coupon` shapes.

### `helpers/divulgador/build-url.ts`

Holds URL assembly that is currently private to the API module. This is still internal logic, but moved out of `lib/api/divulgador.ts` to keep helper code in `helpers/`.

### `helpers/cart/line-pricing.ts`

Contains cart-line pricing logic extracted from the sheet component:

- currency formatting
- line total calculation
- numeric price guards
- line unit-price formatting
- subtotal formatting for cart lines

This helper is intentionally domain-specific rather than generic.

## Import Strategy

All consuming code should import helpers from `@/helpers/...` or relative helper paths inside tests.

Examples:

- `@/lib/storefront/category-filters` -> `@/helpers/storefront/category-filters`
- `@/lib/storefront/coupon-filters` -> `@/helpers/storefront/coupon-filters`
- `@/lib/storefront/search-params` -> `@/helpers/url/read-single-search-param`
- `@/lib/utils/currency` -> `@/helpers/currency/parse-currency-value`
- `@/lib/utils` -> `@/helpers/ui/cn`

`lib/api/divulgador.ts` should continue exporting the same public API for the rest of the app, but it will import helper modules from `helpers/divulgador` instead of sibling `lib` modules.

## Testing Strategy

This refactor should preserve behavior, so the tests should continue asserting the same public contracts.

Coverage to keep green:

- `tests/lib/api/divulgador.test.ts`
- storefront helper tests currently under `tests/lib/storefront/...`
- component tests that depend on helper outputs:
  - `tests/components/product-card.test.tsx`
  - `tests/components/storefront-client.test.tsx`
  - `tests/components/cart-sheet.test.tsx`

Test file placement does not need to move as part of this change. Only imports should be updated where needed.

## Risks

### Import breakage

This is the main risk. Several app, component, and test files import from `lib/*`. The refactor must update all references consistently.

### Hidden duplication

There is duplicated seller-label logic today. The refactor should consolidate it without changing visible labels.

### Over-generalizing helpers

Some helpers are private to one component today. They should still move to `helpers/`, but remain domain-named and narrow in scope instead of becoming generic utility buckets.

## Acceptance Criteria

- `lib/` contains only API integration code and shared types
- all internal helper logic previously in `lib/` lives under `helpers/`
- component-local helper functions covered by this spec are extracted to `helpers/`
- all imports resolve successfully after migration
- existing behavior and tests remain unchanged
- no new generic catch-all utility files are introduced beyond the domain-based structure above
