# Storefront Signature Glass Commerce Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar a storefront para uma estética `Signature Glass Commerce`: premium, clara, alinhada ao DNA azul/violeta da Divulgador Inteligente e orientada a vitrine de ofertas.

**Architecture:** A estrutura funcional atual permanece: `app/page.tsx` continua server-first e `StorefrontClient` continua coordenando busca e categorias locais. A mudança fica concentrada na camada visual, com um sistema de tokens semânticos no Tailwind CSS v4, um hero com vídeo local e um redesign da shell funcional e dos cards para uma leitura `image-led`. O plano também simplifica o fluxo de props removendo do hero o conteúdo de métricas pesadas que hoje só existe para sustentar o layout antigo.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 (`@theme`), Vitest, React DOM test renderer, HTML5 `<video>`, `next/image`

---

## File Structure

- Create: `components/storefront/storefront-hero-media.tsx`
  - Encapsula vídeo local, poster, overlays visuais e fallback do hero.
- Create: `public/videos/storefront-hero.mp4`
  - Asset local do hero em loop curto e silencioso.
- Create: `public/images/storefront-hero-poster.jpg`
  - Poster estático para o hero e fallback do vídeo.
- Create: `tests/components/storefront-header.test.tsx`
  - Garante hero com vídeo, CTA e ausência das métricas pesadas antigas.
- Create: `tests/app/theme-tokens.test.ts`
  - Trava a existência dos tokens semânticos exigidos no `app/globals.css`.
- Modify: `app/layout.tsx`
  - Troca o sistema tipográfico para uma sans premium coerente com a nova direção.
- Modify: `app/page.tsx`
  - Remove fetch/prop de cupons se eles não forem mais exibidos no hero.
- Modify: `app/globals.css`
  - Centraliza todos os tokens semânticos do tema e define a base clara premium.
- Modify: `components/storefront/storefront-header.tsx`
  - Converte o hero atual em hero lifestyle com vídeo, sem cards de métricas acima da dobra.
- Modify: `components/storefront/storefront-client.tsx`
  - Ajusta props, espaçamento e a ordem visual da shell abaixo do hero.
- Modify: `components/catalog/search-box.tsx`
  - Redesenha a barra de busca para a leitura `premium funcional`.
- Modify: `components/catalog/category-filter.tsx`
  - Redesenha a rail de categorias com estados semânticos baseados em tokens.
- Modify: `components/catalog/product-grid.tsx`
  - Redefine a introdução da grade e a densidade visual do catálogo.
- Modify: `components/catalog/product-card.tsx`
  - Remove ruído visual, valoriza imagem e reorganiza preço/metadados para leitura `image-led`.
- Modify: `app/loading.tsx`
  - Alinha o loading state à nova estética premium.
- Modify: `app/error.tsx`
  - Alinha o estado de erro de rota à nova estética premium.
- Modify: `app/global-error.tsx`
  - Alinha o estado de erro global à nova estética premium.
- Modify: `tests/components/storefront-client.test.tsx`
  - Atualiza os contratos de copy e layout da storefront.
- Modify: `tests/components/product-card.test.tsx`
  - Atualiza o contrato do card para a leitura `image-led`.
- Modify: `tests/app/route-states.test.tsx`
  - Atualiza o contrato textual dos estados de rota.

## Implementation Notes

- Use `@test-driven-development` antes de qualquer alteração visual ou estrutural.
- Use `@frontend-design` para manter a direção `Signature Glass Commerce` coesa, sem cair em aparência de SaaS genérico.
- Use `@next-best-practices` ao introduzir o vídeo local: manter o hero como componente renderizável sem depender de APIs client-only desnecessárias.
- Use `@vercel-react-best-practices` para manter `StorefrontClient` derivando estado em render e sem reintroduzir `useEffect` para filtros.
- Para o vídeo do hero, use asset local em `public/` em vez de fonte remota; isso evita CORS, autoplay inconsistente e acoplamento a terceiros.
- Mantenha a base visual sem cores arbitrárias espalhadas nas classes. Toda cor de marca deve sair de token semântico definido no `app/globals.css`.

## Chunk 1: Brand System and Hero Contract

### Task 1: Add failing tests for the semantic theme and the new hero contract

**Files:**
- Create: `tests/app/theme-tokens.test.ts`
- Create: `tests/components/storefront-header.test.tsx`

- [ ] **Step 1: Write the failing token test**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("theme tokens", () => {
  it("defines the semantic storefront tokens in globals.css", () => {
    const css = readFileSync(resolve("app/globals.css"), "utf8");

    expect(css).toContain("--color-brand-primary:");
    expect(css).toContain("--color-brand-accent:");
    expect(css).toContain("--color-surface-glass:");
    expect(css).toContain("--color-hero-overlay:");
    expect(css).toContain("--color-state-active:");
    expect(css).toContain("--shadow-float:");
  });
});
```

- [ ] **Step 2: Write the failing hero test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StorefrontHeader from "../../components/storefront/storefront-header";

describe("StorefrontHeader", () => {
  it("renders a lifestyle video hero without the old stat cards", () => {
    const html = renderToStaticMarkup(
      <StorefrontHeader selectedCoupon={null} />,
    );

    expect(html).toContain("Ofertas em movimento");
    expect(html).toContain("Explorar vitrine");
    expect(html).toContain("<video");
    expect(html).toContain("/videos/storefront-hero.mp4");
    expect(html).not.toContain("Open catalog");
    expect(html).not.toContain("Public coupons");
    expect(html).not.toContain("Coupon state");
  });
});
```

- [ ] **Step 3: Run the targeted tests to verify they fail**

Run: `pnpm vitest run tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx`

Expected: FAIL because the semantic tokens and hero video contract do not exist yet.

- [ ] **Step 4: Commit the failing tests**

```bash
git add tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx
git commit -m "test: define premium storefront theme contract"
```

### Task 2: Implement the token system, new typography, and hero media shell

**Files:**
- Create: `components/storefront/storefront-hero-media.tsx`
- Create: `public/videos/storefront-hero.mp4`
- Create: `public/images/storefront-hero-poster.jpg`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Place the local hero media assets**

Use a short, licensed, silent lifestyle clip and generate a poster image with `ffmpeg`:

```bash
ffmpeg -i assets/reference/storefront-hero-source.mp4 -vf "scale=1600:-2" -an -c:v libx264 -movflags +faststart public/videos/storefront-hero.mp4
ffmpeg -i public/videos/storefront-hero.mp4 -vf "thumbnail,scale=1600:-2" -frames:v 1 public/images/storefront-hero-poster.jpg
```

Expected files:
- `public/videos/storefront-hero.mp4`
- `public/images/storefront-hero-poster.jpg`

- [ ] **Step 2: Swap the font system in `app/layout.tsx`**

```tsx
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

const brandSans = Plus_Jakarta_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

<html
  lang="pt-BR"
  className={`${brandSans.variable} ${geistMono.variable} h-full antialiased`}
>
```

- [ ] **Step 3: Replace the current manual palette with semantic Tailwind v4 tokens**

```css
:root {
  --background: #f7f5ef;
  --surface: #fcfbf8;
  --surface-muted: #f0ede5;
  --surface-glass: rgba(252, 251, 248, 0.72);
  --foreground: #10203f;
  --foreground-muted: rgba(16, 32, 63, 0.68);
  --brand-primary: #234fb6;
  --brand-primary-strong: #173b92;
  --brand-accent: #8b63d9;
  --brand-accent-soft: rgba(139, 99, 217, 0.12);
  --border-soft: rgba(16, 32, 63, 0.1);
  --border-strong: rgba(16, 32, 63, 0.18);
  --hero-overlay: rgba(20, 52, 133, 0.48);
  --hero-tint: rgba(255, 255, 255, 0.2);
  --state-active: var(--brand-primary);
  --state-hover: var(--brand-accent);
  --shadow-soft: 0 18px 60px rgba(16, 32, 63, 0.08);
  --shadow-float: 0 28px 100px rgba(16, 32, 63, 0.14);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-surface-glass: var(--surface-glass);
  --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted);
  --color-brand-primary: var(--brand-primary);
  --color-brand-primary-strong: var(--brand-primary-strong);
  --color-brand-accent: var(--brand-accent);
  --color-border-soft: var(--border-soft);
  --color-border-strong: var(--border-strong);
  --color-hero-overlay: var(--hero-overlay);
  --color-hero-tint: var(--hero-tint);
  --color-state-active: var(--state-active);
  --color-state-hover: var(--state-hover);
  --font-sans: var(--font-brand-sans);
  --font-mono: var(--font-geist-mono);
}
```

- [ ] **Step 4: Create a dedicated hero media component**

```tsx
type StorefrontHeroMediaProps = {
  posterSrc: string;
  videoSrc: string;
};

export default function StorefrontHeroMedia({
  posterSrc,
  videoSrc,
}: StorefrontHeroMediaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-hero-overlay/100" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02))]" />
    </div>
  );
}
```

- [ ] **Step 5: Refactor `StorefrontHeader` to the new hero contract**

```tsx
type StorefrontHeaderProps = {
  selectedCoupon: string | null;
};

export default function StorefrontHeader({ selectedCoupon }: StorefrontHeaderProps) {
  return (
    <header className="relative min-h-[100svh] overflow-hidden rounded-[2.75rem] bg-brand-primary text-white shadow-[var(--shadow-float)]">
      <StorefrontHeroMedia
        posterSrc="/images/storefront-hero-poster.jpg"
        videoSrc="/videos/storefront-hero.mp4"
      />
      <div className="relative flex min-h-[100svh] flex-col justify-between px-6 py-6 sm:px-8 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.22em] uppercase">
            Divulgador Inteligente
          </span>
          <a
            href="#catalogo"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-2.5 text-sm backdrop-blur-md"
          >
            Explorar vitrine
          </a>
        </div>

        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/72">
            Curadoria em movimento
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Ofertas em movimento, com acabamento premium.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Uma vitrine mais refinada para descobrir produtos, abrir cupons e navegar
            por ofertas com ritmo urbano e leitura limpa.
          </p>
          {selectedCoupon ? (
            <p className="mt-8 inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/88 backdrop-blur-md">
              Cupom ativo: {selectedCoupon}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Remove coupon count from the page data flow if the hero no longer needs it**

```tsx
import StorefrontClient from "@/components/storefront/storefront-client";
import { getProducts, getProductsByCoupon } from "@/lib/api/divulgador";

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
  const products = selectedCoupon
    ? await getProductsByCoupon({ coupon: selectedCoupon })
    : await getProducts();

  return (
    <StorefrontClient
      products={products}
      selectedCoupon={selectedCoupon}
    />
  );
}
```

- [ ] **Step 7: Run the targeted tests to verify they pass**

Run: `pnpm vitest run tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx`

Expected: PASS with the semantic token list and hero contract green.

- [ ] **Step 8: Commit the hero system**

```bash
git add app/layout.tsx app/page.tsx app/globals.css components/storefront/storefront-header.tsx components/storefront/storefront-hero-media.tsx public/videos/storefront-hero.mp4 public/images/storefront-hero-poster.jpg tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx
git commit -m "feat: add premium storefront hero system"
```

## Chunk 2: Premium Functional Shell

### Task 3: Add failing integration coverage for the new shell copy and flow

**Files:**
- Modify: `tests/components/storefront-client.test.tsx`

- [ ] **Step 1: Rewrite the storefront expectations around the premium shell**

```tsx
it("renders the premium hero, functional search, and category rail", () => {
  const view = renderStorefront();

  expect(view.container.textContent).toContain(
    "Ofertas em movimento, com acabamento premium.",
  );
  expect(view.container.textContent).toContain("Buscar na vitrine");
  expect(view.container.textContent).toContain("Categorias do momento");
  expect(view.container.textContent).toContain("Selecao aberta");
  expect(view.container.textContent).not.toContain("Catalog for calm review");
});
```

- [ ] **Step 2: Keep the behavioral filter tests and add one copy-level assertion**

```tsx
expect(view.container.textContent).toContain("Todos");
expect(view.container.textContent).toContain("Outros");
expect(view.container.textContent).toContain("Panela Eletrica Electrolux");
```

- [ ] **Step 3: Run the targeted storefront test to verify it fails**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: FAIL because the old copy and shell markup are still present.

- [ ] **Step 4: Commit the failing integration update**

```bash
git add tests/components/storefront-client.test.tsx
git commit -m "test: define premium storefront shell contract"
```

### Task 4: Implement the premium functional shell below the fold

**Files:**
- Modify: `components/storefront/storefront-client.tsx`
- Modify: `components/catalog/search-box.tsx`
- Modify: `components/catalog/category-filter.tsx`
- Modify: `components/catalog/product-grid.tsx`

- [ ] **Step 1: Simplify `StorefrontClient` props and section framing**

```tsx
type StorefrontClientProps = {
  products: Product[];
  selectedCoupon: string | null;
};

<main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
  <div className="relative mx-auto flex w-full max-w-[92rem] flex-col gap-6 lg:gap-8">
    <StorefrontHeader selectedCoupon={selectedCoupon} />

    <section
      id="catalogo"
      className="rounded-[2rem] border border-border-soft bg-surface-glass px-5 py-5 shadow-[var(--shadow-soft)] backdrop-blur-md sm:px-6"
    >
      <SearchBox value={searchQuery} onValueChange={setSearchQuery} />
      <div className="mt-4">
        <CategoryFilter
          options={availableCategories}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />
      </div>
    </section>
```

- [ ] **Step 2: Redesign `SearchBox` to the premium functional layout**

```tsx
<section className="grid gap-4 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-center">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground-muted">
      Busca local
    </p>
    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
      Buscar na vitrine
    </h2>
    <p className="mt-2 text-sm leading-7 text-foreground-muted">
      Refine a seleção atual sem perder o ritmo da descoberta.
    </p>
  </div>

  <label className="rounded-[1.5rem] border border-border-soft bg-surface px-4 py-4 shadow-[var(--shadow-soft)]">
    <span className="sr-only">Buscar produtos da vitrine</span>
    <input
      className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-foreground-muted"
      name="search"
      placeholder="Busque por produto, categoria ou ocasião"
      type="search"
      value={value}
      onInput={(event) => onValueChange((event.target as HTMLInputElement).value)}
    />
  </label>
</section>
```

- [ ] **Step 3: Redesign `CategoryFilter` as a curated rail**

```tsx
<section aria-label="Categorias do catalogo">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
        Navegacao
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
        Categorias do momento
      </h3>
    </div>
  </div>

  <div className="mt-4 flex flex-wrap gap-3">
    {options.map((option) => {
      const isSelected = option.value === selectedValue;

      return (
        <button
          key={option.value}
          type="button"
          className={isSelected
            ? "rounded-full border border-brand-primary bg-brand-primary px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-soft)]"
            : "rounded-full border border-border-soft bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-state-hover hover:text-brand-primary"}
        >
          {option.label}
        </button>
      );
    })}
  </div>
</section>
```

- [ ] **Step 4: Reframe `ProductGrid` to present the catalog as a selection**

```tsx
<section aria-label="Produtos visiveis" className="space-y-6">
  <div className="flex flex-col gap-3 border-b border-border-soft pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
        Vitrine aberta
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
        Selecao aberta
      </h2>
    </div>
    <p className="text-sm leading-7 text-foreground-muted">
      {products.length} ofertas visiveis na curadoria atual.
    </p>
  </div>
</section>
```

- [ ] **Step 5: Run the storefront client test to verify it passes**

Run: `pnpm vitest run tests/components/storefront-client.test.tsx`

Expected: PASS with the premium shell copy and filter interaction preserved.

- [ ] **Step 6: Commit the shell refactor**

```bash
git add app/page.tsx components/storefront/storefront-client.tsx components/catalog/search-box.tsx components/catalog/category-filter.tsx components/catalog/product-grid.tsx tests/components/storefront-client.test.tsx
git commit -m "feat: refine premium storefront shell"
```

## Chunk 3: Image-Led Product Cards and Route States

### Task 5: Add failing tests for the image-led cards and brand-aligned route states

**Files:**
- Modify: `tests/components/product-card.test.tsx`
- Modify: `tests/app/route-states.test.tsx`

- [ ] **Step 1: Add failing product-card assertions for reduced visual noise**

```tsx
it("keeps the product card image-led and removes noisy badges", () => {
  const html = renderToStaticMarkup(
    <ProductCard
      product={{ ...baseProduct, highlight: true, freeShipping: true }}
    />,
  );

  expect(html).toContain("Ver oferta");
  expect(html).not.toContain("Record 1");
  expect(html).not.toContain("Destaque");
  expect(html).not.toContain("Frete gratis");
});
```

- [ ] **Step 2: Add failing route-state assertions for the new Portuguese premium copy**

```tsx
expect(renderToStaticMarkup(<Loading />)).toContain("Preparando a vitrine");
expect(renderToStaticMarkup(
  <ErrorPage error={new Error("route")} unstable_retry={vi.fn()} />,
)).toContain("Nao foi possivel abrir esta vitrine");
expect(renderToStaticMarkup(
  <GlobalErrorPage error={new Error("global")} unstable_retry={vi.fn()} />,
)).toContain("A experiencia saiu do ar");
```

- [ ] **Step 3: Run the targeted tests to verify they fail**

Run: `pnpm vitest run tests/components/product-card.test.tsx tests/app/route-states.test.tsx`

Expected: FAIL because the cards still render the old noisy metadata and the route states still use the previous copy.

- [ ] **Step 4: Commit the failing visual-contract tests**

```bash
git add tests/components/product-card.test.tsx tests/app/route-states.test.tsx
git commit -m "test: define image-led storefront card contract"
```

### Task 6: Implement the image-led card redesign and route-state alignment

**Files:**
- Modify: `components/catalog/product-card.tsx`
- Modify: `app/loading.tsx`
- Modify: `app/error.tsx`
- Modify: `app/global-error.tsx`

- [ ] **Step 1: Redesign `ProductCard` around the image-first hierarchy**

```tsx
<article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border-soft bg-surface shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]">
  <a className="flex h-full flex-col" href={product.link} rel="noreferrer" target="_blank">
    <div className="relative aspect-[4/4.6] overflow-hidden bg-surface-muted">
      {product.imageUrl ? (
        <Image
          alt={product.title}
          className="object-cover transition duration-500 group-hover:scale-[1.015]"
          fill
          sizes="(min-width: 1536px) 32rem, (min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
          src={product.imageUrl}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-center">
          <p className="text-sm text-foreground-muted">Imagem indisponivel</p>
        </div>
      )}
    </div>

    <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
        <span>{getSellerLabel(product.seller)}</span>
        <span>{getCategoryLabel(product.category)}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.04em] text-foreground">
        {product.title}
      </h3>

      <div className="mt-5 space-y-2">
        {product.priceFromLabel ? (
          <p className="text-sm text-foreground-muted line-through">{product.priceFromLabel}</p>
        ) : null}
        <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
          {product.priceLabel ?? "Consulte o preco"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-8">
        <span className="text-sm text-foreground-muted">
          {product.couponCode ? `Cupom ${product.couponCode}` : "Oferta sem cupom destacado"}
        </span>
        <span className="rounded-full border border-border-soft bg-surface-muted px-4 py-2 text-sm font-medium text-foreground">
          Ver oferta
        </span>
      </div>
    </div>
  </a>
</article>
```

- [ ] **Step 2: Align loading and error states to the same premium language**

```tsx
// app/loading.tsx
<p className="text-xs font-semibold uppercase tracking-[0.32em] text-foreground-muted">
  Curadoria em andamento
</p>
<h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
  Preparando a vitrine
</h1>
<p className="mt-4 text-sm leading-7 text-foreground-muted sm:text-base">
  Reunindo produtos, categorias e atmosfera para a selecao atual.
</p>
```

```tsx
// app/error.tsx
<h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
  Nao foi possivel abrir esta vitrine
</h1>
<button ...>Recarregar trecho</button>
```

```tsx
// app/global-error.tsx
<h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
  A experiencia saiu do ar
</h1>
<button ...>Tentar recuperar</button>
```

- [ ] **Step 3: Run the targeted visual tests to verify they pass**

Run: `pnpm vitest run tests/components/product-card.test.tsx tests/app/route-states.test.tsx`

Expected: PASS with the image-led card contract and route-state copy green.

- [ ] **Step 4: Commit the card and route-state redesign**

```bash
git add components/catalog/product-card.tsx app/loading.tsx app/error.tsx app/global-error.tsx tests/components/product-card.test.tsx tests/app/route-states.test.tsx
git commit -m "feat: refine premium storefront cards"
```

## Chunk 4: Verification

### Task 7: Run the full verification sweep and capture manual premium-UI QA

**Files:**
- Review: `app/globals.css`
- Review: `components/storefront/storefront-header.tsx`
- Review: `components/catalog/search-box.tsx`
- Review: `components/catalog/category-filter.tsx`
- Review: `components/catalog/product-card.tsx`

- [ ] **Step 1: Run the focused storefront suite**

Run: `pnpm vitest run tests/app/theme-tokens.test.ts tests/components/storefront-header.test.tsx tests/components/storefront-client.test.tsx tests/components/product-card.test.tsx tests/app/route-states.test.tsx`

Expected: PASS with all new storefront visual contracts green.

- [ ] **Step 2: Run the full project checks**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `pnpm build`
Expected: PASS with the home route still building as an App Router route under Next.js 16.

- [ ] **Step 3: Perform manual responsive and motion QA**

Checklist:
- Open the app with `pnpm dev`
- Validate the hero video autoplay, loop, poster fallback, and text legibility
- Validate desktop/tablet/mobile at approximately `1440px`, `768px`, and `390px`
- Confirm the hero still feels premium with the video paused on arbitrary frames
- Confirm the search box and category rail remain clear and touch-friendly
- Confirm category filters still combine correctly with the text search
- Confirm product cards feel image-first and do not read like marketplace tiles
- Confirm loading/error/global-error screens feel from the same design system

- [ ] **Step 4: Commit the verified final state**

```bash
git add .
git commit -m "feat: ship premium storefront brand redesign"
```
