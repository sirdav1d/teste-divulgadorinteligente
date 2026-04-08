# Hero Scroll Video Reveal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o vídeo da hero começar pequeno e centralizado sobre fundo azul, e expandir com o scroll até virar o background completo da hero, sem quebrar o layout atual do logo e do `h1`.

**Architecture:** A animação de abertura será dirigida pelo progresso de scroll da própria hero. O `StorefrontHeader` continua responsável pelo conteúdo fixo por cima da cena, enquanto `StorefrontHeroMedia` passa a renderizar um wrapper animado do vídeo com escala, tamanho e `border-radius` controlados por `motion/react`. Se necessário, o cálculo do progresso fica isolado em um hook pequeno para não poluir o header.

**Tech Stack:** Next.js 16, React 19, `motion/react`, TypeScript, ESLint

---

### Task 1: Isolar O Progresso De Scroll Da Hero

**Files:**
- Create: `hooks/storefront/use-hero-scroll-reveal.ts`
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Criar o hook de progresso**

Criar um hook que receba/refira a hero e exponha o valor de progresso necessário para a animação do vídeo.

- [ ] **Step 2: Usar a própria hero como referência**

Basear o progresso no scroll da hero, não da página inteira, para a transição terminar dentro da própria seção.

- [ ] **Step 3: Passar o progresso para o media layer**

Atualizar o `StorefrontHeader` para consumir o hook e encaminhar o valor para `StorefrontHeroMedia`, preservando:
- `min-h-dvh`
- largura atual
- logo atual
- `h1` em escada
- animação atual das palavras

### Task 2: Fazer O Vídeo Expandir Com O Scroll

**Files:**
- Modify: `components/storefront/storefront-hero-media.tsx`

- [ ] **Step 1: Transformar o media em componente animado**

Usar `motion` no wrapper do vídeo.

- [ ] **Step 2: Definir o estado inicial**

O vídeo deve começar:
- menor
- centralizado
- com cantos levemente arredondados
- sobre fundo azul da hero

- [ ] **Step 3: Mapear o progresso de scroll para transforms**

Aplicar `useTransform` para animar:
- largura/altura ou inset
- escala percebida
- `border-radius`

- [ ] **Step 4: Garantir o estado final**

Ao final da transição, o vídeo deve:
- ocupar o background completo da hero
- perder quase todo o arredondamento
- ficar sem overlay azul por cima

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
- a hero começa azul com vídeo pequeno central
- o vídeo abre conforme o scroll
- o vídeo vira o background ao final
- logo e `h1` permanecem fixos por cima
- não existe overlay azul sobre o vídeo
- as alterações manuais já feitas na hero continuam preservadas
