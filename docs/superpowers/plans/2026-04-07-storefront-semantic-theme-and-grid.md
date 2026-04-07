# Storefront Semantic Theme And Grid Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover cores arbitrárias do projeto, limpar o hero, centralizar a rail de categorias e transformar a grade em uma vitrine 4-up com reveal progressivo de 12 em 12.

**Architecture:** A lógica server-first da home continua igual. A mudança fica concentrada na camada visual e no estado local de listagem: `app/globals.css` passa a expor todos os tokens semânticos usados no projeto, `StorefrontHeader` e `StorefrontHeroMedia` usam apenas esses tokens e `StorefrontClient` coordena o recorte progressivo da coleção filtrada. A rail de categorias perde a moldura textual e vira um índice centralizado, enquanto a grade passa a renderizar apenas o subset visível e expor a ação `Ver mais`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 (`@theme`), Vitest, `next/image`

---

## File Structure

- Modify: `app/globals.css`
  - Centraliza tokens semânticos para superfícies, textos claros sobre mídia, vidros, overlays, pills e estados.
- Modify: `app/layout.tsx`
  - Mantém metadata e ícones oficiais, sem alterar o fluxo de renderização.
- Modify: `components/storefront/storefront-header.tsx`
  - Remove o CTA superior, mantém só o logo oficial e troca classes arbitrárias por tokens semânticos.
- Modify: `components/storefront/storefront-hero-media.tsx`
  - Ajusta enquadramento da mídia para full-bleed mais convincente e consome tokens semânticos nas camadas.
- Modify: `components/storefront/storefront-client.tsx`
  - Introduz `visibleCount`, aplica recorte de 12 itens e reseta ao mudar filtros.
- Modify: `components/catalog/category-filter.tsx`
  - Remove títulos auxiliares, centraliza a rail e usa tokens semânticos.
- Modify: `components/catalog/product-grid.tsx`
  - Passa a 4 colunas no desktop e recebe dados/ação para `Ver mais`.
- Modify: `components/catalog/search-box.tsx`
  - Alinha a shell ao novo sistema semântico, se necessário.
- Modify: `tests/app/theme-tokens.test.ts`
  - Trava a ausência do grid background antigo e a presença do novo sistema semântico.
- Modify: `tests/components/storefront-header.test.tsx`
  - Trava ausência do botão superior e presença do logo oficial.
- Modify: `tests/components/storefront-client.test.tsx`
  - Cobre rail sem títulos e o comportamento de `Ver mais` com reset por filtros.
- Create: `tests/components/product-grid.test.tsx`
  - Trava o CTA de `Ver mais` e o limite visível em isolamento.

## Implementation Notes

- Use `@test-driven-development` antes de qualquer alteração em componentes ou estado.
- Use `@frontend-design` para manter a leitura premium sem reabrir um redesign de paleta.
- Use `@vercel-react-best-practices` para derivar `visibleProducts` em render e evitar `useEffect` para filtros.
- A limpeza de cores arbitrárias vale para o projeto inteiro. Se surgir um novo vidro/overlay, ele deve nascer como token semântico no `globals.css`.
- Evite adicionar novas dependências; a mudança é estrutural e visual.

## Chunk 1: Semantic Theme Foundation

### Task 1: Add failing tests for semantic-only color usage

**Files:**
- Modify: `tests/app/theme-tokens.test.ts`
- Modify: `tests/components/storefront-header.test.tsx`

- [ ] **Step 1: Extend the theme test for the semantic translucent tokens**

```ts
expect(css).toContain("--color-surface-elevated:");
expect(css).toContain("--color-surface-hero-chip:");
expect(css).toContain("--color-surface-hero-chip-muted:");
expect(css).toContain("--color-text-on-hero:");
expect(css).toContain("--color-text-on-hero-muted:");
expect(css).toContain("--color-border-on-hero:");
expect(css).not.toContain("white/24");
expect(css).not.toContain("white/88");
```

- [ ] **Step 2: Update the hero contract to forbid the top CTA**

```tsx
expect(html).toContain("/brand/divulgador-inteligente-logo.svg");
expect(html).not.toContain("Explorar vitrine");
```

- [ ] **Step 3: Run the targeted tests to verify they fail**

Run: `pnpm vitest run tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx`

Expected: FAIL because the new semantic tokens do not exist yet and the hero still renders the CTA.

- [ ] **Step 4: Commit the failing contract updates**

```bash
git add tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx
git commit -m "test: define semantic storefront theme contract"
```

### Task 2: Implement the semantic theme tokens and hero cleanup

**Files:**
- Modify: `app/globals.css`
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `components/storefront/storefront-hero-media.tsx`

- [ ] **Step 1: Replace hero-specific arbitrary translucency with named semantic tokens**

Add tokens in `app/globals.css`:

```css
:root {
  --surface-elevated: rgba(252, 251, 248, 0.88);
  --surface-hero-chip: rgba(252, 251, 248, 0.14);
  --surface-hero-chip-muted: rgba(252, 251, 248, 0.88);
  --text-on-hero: #ffffff;
  --text-on-hero-muted: rgba(255, 255, 255, 0.8);
  --border-on-hero: rgba(255, 255, 255, 0.24);
}

@theme inline {
  --color-surface-elevated: var(--surface-elevated);
  --color-surface-hero-chip: var(--surface-hero-chip);
  --color-surface-hero-chip-muted: var(--surface-hero-chip-muted);
  --color-text-on-hero: var(--text-on-hero);
  --color-text-on-hero-muted: var(--text-on-hero-muted);
  --color-border-on-hero: var(--border-on-hero);
}
```

- [ ] **Step 2: Remove the top CTA and migrate the logo capsule to semantic classes**

```tsx
<div className="inline-flex items-center rounded-full border border-border-on-hero bg-surface-hero-chip-muted px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
  <Image ... />
</div>
```

- [ ] **Step 3: Make the hero media feel full-bleed**

```tsx
<video
  className="h-full w-full scale-[1.08] object-cover object-center"
  ...
/>
```

And ensure overlay layers use semantic utilities:

```tsx
<div className="absolute inset-0 bg-hero-overlay" />
```

- [ ] **Step 4: Replace hero text colors with semantic text tokens**

```tsx
<p className="text-xs font-semibold uppercase tracking-[0.32em] text-text-on-hero-muted">
...
<h1 className="... text-text-on-hero">
...
```

- [ ] **Step 5: Run the targeted tests to verify they pass**

Run: `pnpm vitest run tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx`

Expected: PASS

- [ ] **Step 6: Commit the semantic theme foundation**

```bash
git add app/globals.css components/storefront/storefront-header.tsx components/storefront/storefront-hero-media.tsx tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx
git commit -m "feat: add semantic storefront theme foundation"
```

## Chunk 2: Centered Category Rail And Progressive Grid

### Task 3: Add failing tests for rail cleanup and progressive reveal

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`
- Create: `tests/components/product-grid.test.tsx`

- [ ] **Step 1: Add failing storefront-client assertions for the category rail cleanup**

```tsx
expect(view.container.textContent).not.toContain("Navegacao");
expect(view.container.textContent).not.toContain("Categorias do momento");
```

- [ ] **Step 2: Add failing assertions for the 12-item progressive reveal**

Extend the fixture to at least 13 items and assert:

```tsx
expect(view.container.textContent).toContain("Ver mais");
expect(view.container.textContent).not.toContain("Produto 13");
```

- [ ] **Step 3: Add a failing reset test when filters change**

```tsx
// Click "Ver mais", then change search/category
expect(view.container.textContent).not.toContain("Produto 13");
```

- [ ] **Step 4: Add an isolated product-grid test for the CTA contract**

```tsx
it("shows a load-more action when more than 12 products are available", () => {
  const html = renderToStaticMarkup(
    <ProductGrid
      products={products.slice(0, 12)}
      totalCount={13}
      onLoadMoreHref="#"
    />,
  );

  expect(html).toContain("Ver mais");
});
```

- [ ] **Step 5: Run the focused tests to verify they fail**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx tests/components/product-grid.test.tsx`

Expected: FAIL because the rail still has helper headings and the grid still renders the full result set.

- [ ] **Step 6: Commit the failing list-contract tests**

```bash
git add tests/components/storefront-client.test.tsx tests/components/product-grid.test.tsx
git commit -m "test: define storefront progressive grid contract"
```

### Task 4: Implement the centered rail and 12-by-12 reveal

**Files:**
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/catalog/category-filter.tsx`
- Modify: `components/catalog/product-grid.tsx`

- [ ] **Step 1: Add local reveal state to `StorefrontClient`**

```tsx
const PAGE_SIZE = 12;
const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

const visibleProducts = filteredProducts.slice(0, visibleCount);
const hasMoreProducts = filteredProducts.length > visibleCount;
```

- [ ] **Step 2: Reset the visible window when the filters change**

Use a dedicated effect only for the reset trigger:

```tsx
useEffect(() => {
  setVisibleCount(PAGE_SIZE);
}, [deferredSearchQuery, selectedCategory]);
```

- [ ] **Step 3: Strip the helper titles from `CategoryFilter` and center the rail**

```tsx
<section aria-label="Categorias do catalogo">
  <div className="flex flex-wrap justify-center gap-3">
    ...
  </div>
</section>
```

- [ ] **Step 4: Rework `ProductGrid` to 4 columns on desktop**

```tsx
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
  {products.map(...)}
</div>
```

- [ ] **Step 5: Add the `Ver mais` action**

Give `ProductGrid` the explicit interface:

```tsx
type ProductGridProps = {
  products: Product[];
  totalCount: number;
  onLoadMore?: () => void;
};
```

Then render:

```tsx
{totalCount > products.length && onLoadMore ? (
  <div className="flex justify-center pt-4">
    <button
      type="button"
      onClick={onLoadMore}
      className="rounded-full border border-border-soft bg-surface px-6 py-3 text-sm font-medium text-foreground"
    >
      Ver mais
    </button>
  </div>
) : null}
```

- [ ] **Step 6: Wire the grid from `StorefrontClient`**

```tsx
<ProductGrid
  products={visibleProducts}
  totalCount={filteredProducts.length}
  onLoadMore={
    hasMoreProducts ? () => setVisibleCount((count) => count + PAGE_SIZE) : undefined
  }
/>
```

- [ ] **Step 7: Run the focused tests to verify they pass**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx tests/components/product-grid.test.tsx`

Expected: PASS

- [ ] **Step 8: Commit the rail and grid behavior**

```bash
git add components/storefront/storefront-client.tsx components/catalog/category-filter.tsx components/catalog/product-grid.tsx tests/components/storefront-client.test.tsx tests/components/product-grid.test.tsx
git commit -m "feat: add progressive storefront grid"
```

## Chunk 3: Global Cleanup And Verification

### Task 5: Sweep remaining arbitrary color usage and align related components

**Files:**
- Modify: `components/catalog/search-box.tsx`
- Review: `components/catalog/product-card.tsx`
- Review: `app/error.tsx`
- Review: `app/global-error.tsx`
- Review: `app/loading.tsx`

- [ ] **Step 1: Search for remaining arbitrary color classes**

Run:

```bash
rg -n "white/|black/|rgba?\(|#[0-9A-Fa-f]{3,8}" app components
```

Expected: only token definitions inside `app/globals.css`, not arbitrary component classes.

- [ ] **Step 2: Replace any remaining component-level arbitrary classes with semantic ones**

Examples to eliminate:
- `bg-white/18`
- `text-white`
- `text-white/80`
- `border-white/24`

- [ ] **Step 3: Run the full storefront-focused suite**

Run:

```bash
pnpm vitest run tests/app/theme-tokens.test.ts tests/app/layout-metadata.test.ts tests/components/storefront-header.test.tsx tests/components/storefront-client.test.tsx tests/components/product-grid.test.tsx
```

Expected: PASS

- [ ] **Step 4: Run the full project checks**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `pnpm build`
Expected: PASS

- [ ] **Step 5: Perform manual QA**

Checklist:
- confirm the hero top bar has only the logo
- confirm the video feels full-bleed on desktop and mobile
- confirm category pills are centered with no helper headings
- confirm only 12 items render initially
- confirm `Ver mais` reveals 12 more
- confirm changing search/category resets the visible subset
- confirm the 4-column desktop grid still reads cleanly

- [ ] **Step 6: Commit the final verified state**

```bash
git add .
git commit -m "feat: ship semantic storefront theme cleanup"
```
