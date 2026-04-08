# Cart Sheet Line Pricing And Layout Design

## Goal

Make each cart-sheet line show quantity-aware pricing and remove the visual gap under product images when the text and controls make the line taller.

## Current Context

- The cart sheet is rendered in `components/cart/cart-sheet.tsx`.
- Each line currently shows the unit price label as the highlighted value, even when quantity is greater than `1`.
- The sheet subtotal already multiplies unit price by quantity, so the per-line display is inconsistent with the subtotal.
- The product image column uses a fixed square size (`size-20`), while the content column can grow taller because of title, coupon text, quantity control, and pricing.

## Approved Interaction

- Each cart line should show:
  - a small secondary line in the format `6 x R$ 77,99`
  - a highlighted line total in the format `R$ 467,94`
- The subtotal behavior remains unchanged and should continue matching the sum of line totals.
- If a product does not provide numeric pricing, the UI should keep a safe fallback instead of trying to compute a total.

## Recommended Approach

### 1. Treat the sheet price block as line pricing

In `components/cart/cart-sheet.tsx`:

- derive each line total from `priceValue * quantity`
- format the line total with the existing BRL formatter
- render unit-price detail separately as quantity × unit price

This keeps the cart sheet internally consistent:
- card/sheet quantity controls change quantity
- line total changes with quantity
- subtotal remains coherent with all visible line totals

### 2. Make the image column fill the line better

Instead of a fixed `size-20` square that leaves empty space below it when the content column grows taller:

- give the image wrapper a fixed width with stretch-friendly height behavior
- preserve rounded corners and `object-cover`
- keep a minimum visual height so small lines still look balanced

This removes the visible “hole” under the image while keeping the existing card-like line appearance.

## Data And Formatting Rules

- `unitPrice = line.product.priceValue ?? null`
- `lineTotal = unitPrice * line.quantity` when `unitPrice` exists
- Small caption:
  - show `N x <unit price>` only when numeric price exists
- Highlight:
  - show computed line total when numeric price exists
  - otherwise use the existing text fallback such as `Consulte o preço`

## Testing Strategy

- Update cart-sheet-focused coverage to assert quantity-aware line pricing
- Update storefront integration coverage so increment/decrement in the sheet changes the visible line price along with quantity
- Keep subtotal assertions consistent with the quantity-aware line totals

## Out Of Scope

- Changing card pricing outside the cart sheet
- Reworking subtotal logic
- Adding persistence or server-side cart behavior
- New animations or major visual redesign of the sheet
