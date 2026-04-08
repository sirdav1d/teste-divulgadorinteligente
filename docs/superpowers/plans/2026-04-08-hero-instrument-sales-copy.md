# Hero Instrument Sales Copy Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar a hero para usar `Instrument Serif` apenas no `h1`, trocar a copy principal por `Divulgue. / Venda. / Cresça.` e aplicar a composição em escada aprovada.

**Architecture:** A mudança fica contida na borda tipográfica e no componente da hero. A fonte nova entra via `next/font/google` no layout raiz, é exposta como variável CSS sem afetar o restante da interface, e o `StorefrontHeader` passa a renderizar o `h1` em três spans com alinhamentos distintos para controlar a escada em desktop e mobile.

**Tech Stack:** Next.js 16 App Router, React 19, `next/font/google`, TypeScript, Vitest, ESLint

---

### Task 1: Registrar A Fonte Display Da Hero

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Escrever a expectativa de integração da nova fonte**

Usar o teste da hero como alvo posterior para validar que o `h1` usa a classe/estrutura nova, sem tocar ainda no componente.

- [ ] **Step 2: Registrar `Instrument Serif` no layout**

Adicionar a importação via `next/font/google` em `app/layout.tsx`, criando uma variável dedicada, por exemplo `--font-hero-display`.

- [ ] **Step 3: Expor a variável no tema global**

Em `app/globals.css`, adicionar um token semântico para a fonte display da hero, sem substituir `--font-sans` nem `--font-heading` existentes.

- [ ] **Step 4: Verificar que não houve regressão tipográfica global**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

### Task 2: Travar A Nova Hero Em Teste

**Files:**
- Modify: `tests/components/storefront-header.test.tsx`

- [ ] **Step 1: Escrever o teste vermelho da nova copy**

Adicionar expectativas para:
- presença de `Divulgue.`, `Venda.` e `Cresça.`
- ausência de `Ofertas em movimento, com acabamento premium.`
- presença do novo parágrafo de venda
- presença do gancho/classe que aplica a fonte display no `h1`

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run:

```bash
pnpm vitest run tests/components/storefront-header.test.tsx
```

Expected: FAIL porque a hero ainda usa a copy e a composição antigas.

### Task 3: Implementar A Nova Composição Da Hero

**Files:**
- Modify: `components/storefront/storefront-header.tsx`

- [ ] **Step 1: Reestruturar o `h1`**

Trocar o texto único por três spans/blocos:

```tsx
<h1 className="... font-hero-display ...">
  <span className="block w-fit">Divulgue.</span>
  <span className="block w-fit self-center">Venda.</span>
  <span className="block w-fit self-end">Cresça.</span>
</h1>
```

- [ ] **Step 2: Atualizar a copy secundária**

Substituir o parágrafo atual por:

```tsx
Transforme links, cupons e ofertas em uma vitrine pronta para converter atenção em venda.
```

- [ ] **Step 3: Ajustar o layout responsivo**

Garantir que:
- a escada continue legível em mobile
- o bloco do título não colida com logo/carrinho
- o alinhamento em escada exista também em telas menores, ainda que com offsets mais discretos

- [ ] **Step 4: Rodar o teste da hero**

Run:

```bash
pnpm vitest run tests/components/storefront-header.test.tsx
```

Expected: PASS.

### Task 4: Verificação Final

**Files:**
- Modify as needed: `app/layout.tsx`, `app/globals.css`, `components/storefront/storefront-header.tsx`, `tests/components/storefront-header.test.tsx`

- [ ] **Step 1: Rodar TypeScript**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 2: Rodar os testes focados**

Run:

```bash
pnpm vitest run tests/components/storefront-header.test.tsx tests/components/storefront-client.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Rodar ESLint nos arquivos tocados**

Run:

```bash
pnpm eslint app/layout.tsx app/globals.css components/storefront/storefront-header.tsx tests/components/storefront-header.test.tsx
```

Expected: sem erros.
