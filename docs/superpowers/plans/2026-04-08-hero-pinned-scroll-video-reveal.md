# Hero Pinned Scroll Video Reveal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajustar a animação atual da hero para que o vídeo inicial fique 50% menor e a hero fique pinned consumindo o scroll até o vídeo abrir por completo.

**Architecture:** A implementação atual já separa progresso de scroll, header e media. Esta iteração recalibra essa arquitetura: o header passa a ter uma área de scroll maior com uma viewport sticky, o hook mede o progresso dentro dessa fase pinned, e o media usa esse progresso para sair de uma janela central menor até o full background, sem mover o logo nem o `h1`.

**Tech Stack:** Next.js 16, React 19, `motion/react`, TypeScript, ESLint

---

### Task 1: Transformar A Hero Em Uma Fase Pinned

**Files:**
- Modify: `components/storefront/storefront-header.tsx`
- Modify: `hooks/storefront/use-hero-scroll-reveal.ts`

- [ ] **Step 1: Dar altura extra de scroll para a hero**

Estruturar o header para ter:
- um wrapper externo com altura maior que `100dvh`
- uma área interna sticky com `top: 0` e altura de viewport

- [ ] **Step 2: Preservar o foreground atual**

Manter intactos:
- logo
- `h1` em escada
- animação atual das palavras
- layout e larguras aprovados hoje

- [ ] **Step 3: Recalibrar o hook de progresso**

Fazer `useHeroScrollReveal` ler o progresso da fase pinned, não apenas da altura simples da hero, para que toda a abertura do vídeo aconteça antes do scroll normal continuar.

### Task 2: Reduzir O Vídeo Inicial E Completar A Abertura

**Files:**
- Modify: `components/storefront/storefront-hero-media.tsx`

- [ ] **Step 1: Reduzir o estado inicial em 50%**

Recalibrar a transformação inicial do vídeo para metade do tamanho visual atual.

- [ ] **Step 2: Preservar o centro e os cantos arredondados**

O vídeo deve continuar:
- centralizado
- levemente arredondado no início

- [ ] **Step 3: Fazer a abertura completar dentro da fase pinned**

Mapear o novo progresso para:
- escala/expansão
- `border-radius`
- sombra inicial, se ainda fizer sentido

- [ ] **Step 4: Garantir o estado final**

Ao final da fase pinned:
- o vídeo ocupa o fundo inteiro
- o arredondamento praticamente some
- o scroll da página volta ao comportamento normal
- não existe overlay azul sobre o vídeo

### Task 3: Verificação

**Files:**
- Modify as needed: `components/storefront/storefront-header.tsx`, `components/storefront/storefront-hero-media.tsx`, `hooks/storefront/use-hero-scroll-reveal.ts`

- [ ] **Step 1: Rodar TypeScript**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 2: Rodar ESLint nos arquivos tocados**

Run:

```bash
pnpm eslint components/storefront/storefront-header.tsx components/storefront/storefront-hero-media.tsx hooks/storefront/use-hero-scroll-reveal.ts
```

Expected: sem erros.

- [ ] **Step 3: Revisar visualmente no navegador**

Confirmar manualmente que:
- o vídeo inicial está visivelmente 50% menor que o estado atual
- a hero fica pinned enquanto o vídeo abre
- o scroll é consumido pela abertura
- o scroll normal só continua depois do full reveal
- logo e `h1` permanecem estáticos por cima
- não existe overlay azul sobre o vídeo
