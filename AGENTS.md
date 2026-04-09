<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Architecture Rules

## Core principles
- Prefer server-first architecture.
- Keep client boundaries as small as possible.
- Move pure logic out of components and hooks when it can live in shared utilities.
- Keep data contracts explicit and stable.
- Favor predictable folder responsibility over convenience imports.

## Folder responsibilities

### `app/`
- Store App Router entrypoints and route-level files only.
- Use for pages, layouts, route handlers, loading states, error states, and not-found boundaries.
- Keep route files thin; parsing, domain logic, normalization, and remote integration should live elsewhere.

### `components/`
- Store UI components and visual composition.
- Components should primarily render, compose props, and wire interactions.
- Do not turn components into a dumping ground for fetch, cache, parsing, or broad business logic.

### `lib/`
- Store domain orchestration, server-side integration, cache strategy, remote fetch logic, and non-React application services.
- This is the correct place for catalog orchestration, remote API integration, and cache-aware data flows.

### `stores/`
- Store shared client state only when it is truly cross-component.
- Keep store APIs focused, explicit, and selector-friendly.
- Do not use stores for data that can stay local to a component or hook.

### `hooks/`
- Store React hooks and files directly coupled to hook orchestration.
- Use for stateful or reactive behavior: effects, browser APIs, URL sync, store integration, lifecycle, and composition of other hooks.
- Prefer `useXxx.ts` naming for public hooks.
- Do not place generic pure utilities here unless they are clearly private support for a hook.

### `constants/`
- Store static, immutable application values.
- Use for limits, fixed labels, defaults, configuration values, key maps, and other runtime constants.
- Do not place business logic here.

### `helpers/`
- Store pure, reusable utility functions.
- Use for formatting, normalization, deterministic transforms, filters, calculations, and URL/string builders.
- Helpers should not depend on React, effects, fetch, cache orchestration, or other side effects.

### `types/`
- Store shared TypeScript contracts.
- Use for `type`, `interface`, aliases, payload contracts, and shared structural typing.
- Avoid runtime logic in this folder; keep it focused on typing.

### `tests/`
- Store behavior, contract, integration, and architectural tests.
- Prefer validating flows, state transitions, accessibility semantics, and stable data contracts.
- Avoid fragile tests based on visual layout, Tailwind classes, or copy unless the text itself is contractual.

## Short rule of thumb
- `app` = route entrypoints
- `components` = UI composition
- `lib` = domain and server orchestration
- `stores` = shared client state
- `hooks` = reactive behavior
- `constants` = fixed values
- `helpers` = pure functions
- `types` = type contracts
- `tests` = behavioral verification

## Dependency rules
- `helpers/` must not import from `components/`, `hooks/`, `stores/`, or `app/`.
- `types/` must not contain runtime logic.
- `constants/` must not hide business rules that belong in `helpers/` or `lib/`.
- `components/` may consume `hooks/`, `helpers/`, `constants/`, `types/`, and `stores/`, but should not own heavy business orchestration.
- `hooks/` may consume `helpers/`, `constants/`, `types/`, and `stores/`, but generic reusable logic should be extracted when it stops being hook-specific.
- `app/` should compose route behavior, not reimplement domain logic that belongs in `lib/`.
- `lib/` is the preferred layer for server-side orchestration, integration, normalization, and cache-aware workflows.

## Server and client component rules
- Default to Server Components.
- Use `'use client'` only when the file needs client-only hooks, browser APIs, event handlers, animation state, or direct store interaction.
- Do not promote a parent subtree to client without a clear reason.
- Keep client islands narrow and intentional.
- Server-side data access, cache policy, and remote orchestration should stay out of client components.

## Data and cache rules
- Follow the local Next.js 16 documentation in `node_modules/next/dist/docs/` before changing data flow or caching.
- Use `use cache` only for server-side reads with a clear caching intention.
- `cacheLife` and `cacheTag` should be granular and reflect the actual resource being cached.
- Do not hide expensive scans or broad remote fetch loops inside generic cached functions without documenting the cost.
- Keep fetch, normalization, pagination, search, and category aggregation separable when the responsibilities are materially different.

## Route handler rules
- Route handlers should parse input, validate query params, normalize defaults, and return stable JSON contracts.
- Remote API calls, domain assembly, and business orchestration belong in `lib/`.
- Invalid or ambiguous request input should fail predictably.
- Error payloads should be stable and explicit.

## Testing rules
- Prefer tests for behavior, contracts, state transitions, route handlers, stores, hooks, and data flows.
- Avoid tests that mainly assert presentation classes, exact layout structure, or marketing copy.
- Keep accessibility assertions focused on behaviorally relevant semantics such as roles, labels, `aria-*`, focus, and status announcements.
- Add architecture tests when they protect an important structural decision.

## Asset and image policy
- Continue using native HTML `<img>` for dynamic remote assets in this project.
- Do not migrate these asset surfaces to `next/image` by default.
- Reason: asset origins are dynamic and we cannot reliably predict every remote host up front for `images.remotePatterns`.
- Revisit this only if the asset pipeline becomes constrained enough to define and maintain a reliable allowlist strategy.

## Encoding and text hygiene
- Keep text files in UTF-8.
- Do not introduce mojibake or mixed-encoding literals.
- Fix broken encoding when encountered in source, tests, metadata, or route states.

## Verification rules
- Before claiming work is complete, run the checks relevant to the scope.
- Standard verification baseline:
- `pnpm vitest run`
- `pnpm eslint .`
- `pnpm exec tsc --noEmit`
- `pnpm build`

## Current project decisions
- Prefer server-first composition with small client boundaries.
- Keep metadata basic in the root layout unless requirements change.
- Do not add observability tooling yet.
- Do not add tests whose primary purpose is to validate visual layout or static copy.
- Keep native `<img>` for the current dynamic asset model.
- Avoid barrel re-export files like `lib/divulgador.ts` when they only mirror internal modules; import from the concrete module paths instead.
- Reserve `app/` for Next.js route entrypoints and route-state files only; shared hooks belong under a neutral folder such as `hooks/shared/` rather than `hooks/app/`.
- Keep test folders aligned with the layer they exercise: use `tests/routes/` for App Router coverage and `tests/stores/` for store logic; avoid a top-level `tests/app/` bucket and avoid a standalone `tests/storefront/` bucket when a layer-specific home exists.
- Keep API route contracts and request/response parsing helpers in `lib/<domain>/` alongside the server-side integration layer; `app/api/*/route.ts` should stay as the thin entrypoint.

## Anti-patterns
- Do not place pure reusable logic inside components just because it is currently used once.
- Do not place generic utility logic inside hooks just because the first caller is a hook.
- Do not use `constants/` as a hiding place for business rules.
- Do not put runtime values or helpers inside `types/`.
- Do not move server orchestration into client code for convenience.
- Do not let route files grow into domain-service modules.
