# Semantic Constants Architecture Design

Date: 2026-04-08

## Goal

Move semantic and configurable values out of helpers, components, and internal integration modules into a dedicated `constants/` tree.

## Rule

Only semantic/configurable values should move to `constants/`.

Examples included in scope:

- filter sentinel values
- pagination limits
- seller label maps
- integration base URLs
- integration site identifiers

Examples excluded from scope:

- local implementation-only `const` values with no architectural meaning
- component declarations stored in `const`
- test-local fixtures unless shared across files

## Target Boundary

After this refactor:

- `constants/` owns semantic/configurable values
- `helpers/` owns behavior and transformations
- `components/` consume constants but do not define shared semantic values inline
- `lib/` remains limited to integration entrypoints and type contracts

## Proposed Structure

```text
constants/
  divulgador/
    api.ts
  storefront/
    filters.ts
    pagination.ts
    sellers.ts
```

## Values To Move

### `constants/storefront/filters.ts`

- `ALL_CATEGORY_VALUE`
- `OTHER_CATEGORY_VALUE`
- `ALL_COUPON_VALUE`

### `constants/storefront/pagination.ts`

- `PAGE_SIZE`

### `constants/storefront/sellers.ts`

- `SELLER_LABELS`

### `constants/divulgador/api.ts`

- `API_BASE_URL`
- `SITE_NAME`

## Ownership Changes

### Helpers

- `helpers/storefront/category-filters.ts` should import filter constants instead of defining them
- `helpers/storefront/coupon-filters.ts` should import coupon filter constants instead of defining them
- `helpers/storefront/seller-label.ts` should import `SELLER_LABELS` instead of defining the record inline
- `helpers/divulgador/build-url.ts` should import `API_BASE_URL`

### Components

- `components/storefront/storefront-catalog-client.tsx` should import `PAGE_SIZE` instead of defining it locally

### Integration

- `lib/api/divulgador.ts` should import `SITE_NAME` instead of defining it locally

## Testing Strategy

Extend the existing architecture test to enforce the boundary:

- these semantic/configurable values must no longer be declared inline in the files listed above
- the expected constants files must exist under `constants/`

Behavioral tests should remain green without changing assertions, since this is a structure-only refactor.

Recommended verification:

- architecture test
- existing storefront/helper tests
- `pnpm exec tsc --noEmit`
- focused `eslint`

## Risks

### Over-extraction

The main risk is moving values that are merely local implementation details. This refactor must stay limited to semantic/configurable values only.

### Broken imports

The values being moved are referenced by helpers, components, and integration code. Import paths must be updated consistently.

## Acceptance Criteria

- semantic/configurable values in scope live under `constants/`
- helpers and components import these values instead of defining them inline
- no behavioral changes occur
- architecture test enforces the new boundary
- TypeScript, tests, and lint remain green
