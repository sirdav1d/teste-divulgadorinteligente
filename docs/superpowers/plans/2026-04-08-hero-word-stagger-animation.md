# Hero Word Stagger Animation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animar as três palavras do `h1` da hero com `motion.dev`, em cascata suave, apenas uma vez no carregamento inicial.

**Architecture:** A mudança fica toda dentro do `StorefrontHeader`. O `h1` passa a ser um container `motion` com `variants` de stagger, e cada palavra vira um `motion.span` com entrada por `opacity`, `y` e `blur`, sem alterar a composição em escada nem introduzir novo estado React.

**Tech Stack:** Next.js 16, React 19, `motion/react`, TypeScript, ESLint

---

### Task 1: Introduzir Motion Na Hero

**Files:**
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Importar `motion` no header**

Adicionar `motion` de `motion/react` no arquivo da hero.

- [ ] **Step 2: Definir os variants do container e das palavras**

Criar constantes locais para:
- container com `initial="hidden"` e `animate="visible"`
- `staggerChildren` curto
- transição total percebida próxima de `0.6s`
- easing suave, sem bounce

- [ ] **Step 3: Trocar os spans estáticos por `motion.span`**

Aplicar em cada palavra:
- `opacity: 0 -> 1`
- `y: 20 -> 0`
- `filter: blur(10px) -> blur(0px)`

- [ ] **Step 4: Preservar a escada atual**

Manter:
- primeira palavra alinhada à esquerda
- segunda centralizada
- terceira alinhada à direita

- [ ] **Step 5: Garantir execução única**

Usar apenas o ciclo normal de mount do `motion`, sem `whileInView`, sem loop, sem replay em scroll.

### Task 2: Verificação

**Files:**
- Modify as needed: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Rodar TypeScript**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 2: Rodar ESLint no arquivo tocado**

Run:

```bash
pnpm eslint components/storefront/storefront-header.tsx
```

Expected: sem erros.

- [ ] **Step 3: Revisar visualmente no navegador**

Confirmar manualmente que:
- as palavras entram uma após a outra
- a sensação total é curta e suave
- a animação só acontece no carregamento
- a escada continua intacta em desktop e mobile
