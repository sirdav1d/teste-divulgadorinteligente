# Product Card Hide Empty Coupon Design

Data: 2026-04-07
Status: Aprovado em conversa, aguardando revisao final do documento

## Context

O `ProductCard` hoje renderiza um texto fallback quando `couponCode` e nulo:

- `Oferta sem cupom destacado`

Esse texto ocupa espaco no rodape do card mesmo quando nao existe cupom real para comunicar.

## Goal

Quando nao houver cupom:

- o texto de cupom deve sumir completamente
- o rodape do card nao deve reservar placeholder
- o CTA `Ver oferta` deve permanecer sozinho no rodape

## Approved Direction

### 1. Conditional Coupon Rendering

O bloco textual do cupom deve ser renderizado apenas quando `product.couponCode` existir.

Se `couponCode` for nulo:

- nao renderizar `span`
- nao renderizar fallback textual alternativo

### 2. Footer Layout

O rodape continua sendo o container do CTA.

Quando houver cupom:

- o texto do cupom permanece a esquerda
- o botao continua a direita

Quando nao houver cupom:

- o botao fica sozinho no rodape
- o layout nao deve manter espaco visual reservado para o texto removido

## Files Affected

- `components/catalog/product-card.tsx`
- `tests/components/product-card.test.tsx`

## Validation

Validar:

- `Oferta sem cupom destacado` nao aparece mais
- cards com cupom ainda mostram `Cupom <codigo>`
- `Ver oferta` continua renderizado
- testes, lint e build continuam passando
