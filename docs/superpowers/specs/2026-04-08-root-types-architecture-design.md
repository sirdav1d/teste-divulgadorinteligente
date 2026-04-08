# Root Types Architecture Design

Date: 2026-04-08

## Goal

Make the root `/types` directory the single home for shared application types and interfaces.

## Rule

After this change:

- shared application types and interfaces live under `/types`
- no source file imports from `lib/types`
- internal source files should prefer `@/types/...` for shared type imports

## Scope

Included:

- updating remaining imports that still reference old or relative type paths where appropriate
- updating the architecture test to enforce the new boundary

Not included:

- splitting `types/divulgador.ts` into smaller modules
- renaming existing shared types
- moving runtime code into `/types`

## Current State

The real shared type file already exists at:

- `types/divulgador.ts`

The remaining inconsistency is architectural enforcement and import normalization.

## Target Boundary

### Allowed

- `@/types/divulgador`
- relative imports that resolve to `/types/...` only if there is a strong local reason

### Disallowed

- any import from `lib/types`
- architecture tests expecting shared types under `lib`

## Files Expected To Change

- `lib/api/divulgador.ts`
- `tests/architecture/helpers-architecture.test.ts`
- any additional files still using non-root shared type import patterns if normalization is beneficial

## Testing Strategy

Extend the architecture test to assert:

- `lib/` contains only `api/divulgador.ts`
- the shared type contract exists at `types/divulgador.ts`
- no file in the active architecture boundary imports from `lib/types`

Then verify with:

- architecture test
- `pnpm exec tsc --noEmit`
- focused lint if imports change

## Acceptance Criteria

- `/types` is the single home for shared application types/interfaces
- no active import points to `lib/types`
- architecture test enforces the new boundary
- TypeScript and tests remain green
