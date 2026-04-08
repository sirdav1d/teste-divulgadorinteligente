# Hero Word Stagger Animation Design

Date: 2026-04-08

## Goal

Animar as três palavras do `h1` da hero com `motion.dev`, de forma suave, em sequência, apenas uma vez no carregamento inicial da página.

## Decision

Usar `motion/react` com `variants` no container do `h1` e `motion.span` para cada palavra.

Essa abordagem centraliza o timing, mantém a composição em escada já aprovada e evita delays espalhados manualmente pelo componente.

## Motion Behavior

- a animação roda somente no mount da hero
- não deve repetir em scroll
- não deve ficar em loop
- cada palavra entra uma após a outra

## Visual Direction

Cada palavra usa:

- `opacity` de `0` para `1`
- leve deslocamento vertical de baixo para cima
- blur leve na entrada

Estado inicial:

- `opacity: 0`
- `y: 20`
- `filter: blur(10px)`

Estado final:

- `opacity: 1`
- `y: 0`
- `filter: blur(0px)`

## Timing

- sensação total de aproximadamente `0.6s`
- stagger curto entre as palavras
- easing suave, sem bounce

## Scope

- alterar apenas `components/storefront/storefront-header.tsx`
- manter a copy e a composição em escada atuais
- não alterar carrinho, vídeo, logo ou demais elementos da hero

## Testing

Nenhum teste novo será adicionado, por preferência do usuário.

## Acceptance Criteria

- `Divulgue.`, `Venda.` e `Cresça.` entram em cascata
- a animação é suave e curta
- a animação acontece só uma vez no carregamento
- a escada do `h1` permanece intacta
