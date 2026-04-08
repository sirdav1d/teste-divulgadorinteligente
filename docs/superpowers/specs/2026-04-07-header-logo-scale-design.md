# Header Logo Scale Design

## Goal

Increase only the storefront header logo by 20% while preserving its current proportions and leaving the footer logo unchanged.

## Current Context

- The hero/header logo is rendered in `components/storefront/storefront-header.tsx`.
- Its rendered size is controlled by Tailwind height classes plus `w-auto`, so visual scaling can be handled without changing the asset itself.
- The footer uses the same asset in `components/storefront/storefront-footer.tsx`, but that usage should remain untouched.

## Recommended Approach

Increase the header logo height classes by approximately 20%:

- base breakpoint: from `h-9` to `h-11`
- `sm` breakpoint and above: from `sm:h-10` to `sm:h-12`

This preserves the current responsive behavior, keeps the aspect ratio stable with `w-auto`, and avoids introducing transform-based scaling that could interfere with layout or animation.

## Acceptance Criteria

- The header logo appears visibly larger, approximately 20% bigger than before.
- The footer logo remains unchanged.
- The logo asset path remains `/brand/divulgador-inteligente-logo.svg`.
- Existing header content and spacing continue to render correctly.
