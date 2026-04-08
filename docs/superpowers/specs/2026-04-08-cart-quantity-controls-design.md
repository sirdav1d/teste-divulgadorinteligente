# Cart Quantity Controls Design

## Goal

Replace the single add-to-cart CTA on product cards with iFood-style quantity controls after the first add, and use the same quantity controls inside the cart sheet for visual and behavioral consistency.

## Current Context

- Cart state lives in `components/storefront/storefront-experience.tsx` as `cartLines`.
- Product cards in `components/catalog/product-card.tsx` only expose a single `Adicionar ao carrinho` button.
- The cart sheet in `components/cart/cart-sheet.tsx` currently removes a line with a trash button and shows quantity as static text.
- Product grid and catalog client already pass cart actions downward, so this feature can be added without changing the route structure.

## Interaction Model

- A product card shows `Adicionar ao carrinho` only when its quantity is `0`.
- The first click adds the item to the cart with quantity `1` and immediately swaps the card CTA to a quantity control.
- The quantity control uses three parts: decrement button, current quantity, increment button.
- Incrementing or decrementing on the card updates the same cart state used by the cart sheet.
- When decrementing from `1` to `0`, the line is removed from the cart and the card returns to the single CTA.
- The cart sheet uses the same quantity control pattern instead of a separate remove icon, so both surfaces stay visually aligned.

## Recommended Architecture

Create a shared quantity-control component and keep `StorefrontExperience` as the single owner of cart state and cart mutations.

### Components

- `components/cart/cart-quantity-control.tsx`
  - Shared presentational control for `- / quantity / +`
  - Supports small visual variants for cards and cart sheet
  - Receives quantity and callbacks only

- `components/catalog/product-card.tsx`
  - Receives current quantity plus add/increment/decrement handlers
  - Renders the primary CTA when quantity is `0`
  - Renders the shared control when quantity is greater than `0`

- `components/cart/cart-sheet.tsx`
  - Replaces the trash/remove action and static quantity pill with the shared control
  - Keeps subtotal logic unchanged

- `components/storefront/storefront-experience.tsx`
  - Continues owning `cartLines`
  - Exposes three cart actions:
    - add or increment by product
    - decrement by product id
    - clear cart
  - Derives per-product quantity for the catalog cards

- `components/catalog/product-grid.tsx`
  - Becomes a pass-through for quantity and cart action props

- `components/storefront/storefront-catalog-client.tsx`
  - Passes the new quantity/action props from experience to the grid

## Data Flow

1. `StorefrontExperience` stores cart lines and derives `itemCount`.
2. It also derives each product card quantity from `cartLines`.
3. Cards and cart sheet call the same increment/decrement handlers.
4. The cart trigger badge and subtotal update automatically from the same source of truth.

## Error Handling And Edge Cases

- Decrementing a non-existent line should no-op.
- Quantity should never render below `0`.
- Removing the last unit of a product should fully remove that line from `cartLines`.
- Products without coupon/image data keep their current fallback behavior.

## Testing Strategy

- Update `tests/components/product-card.test.tsx`
  - verify the card still shows the single CTA at quantity `0`
  - verify the card shows quantity controls at quantity `> 0`

- Update `tests/components/storefront-client.test.tsx`
  - verify clicking `Adicionar ao carrinho` swaps the card to quantity controls
  - verify the same quantity appears in the cart sheet
  - verify increment/decrement on card and sheet remain synchronized
  - verify decrementing to zero returns the card to the single CTA

## Out Of Scope

- New motion design for the CTA swap
- Persistence across page reloads
- Coupon or subtotal rule changes
- Server-side cart storage
