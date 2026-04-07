# Storefront Semantic Theme And Grid Design

## Context

Esta rodada não muda o propósito funcional da vitrine. O objetivo é refinar a base visual e o comportamento de navegação sem descaracterizar a identidade já aprovada.

O projeto já tem:
- hero premium com vídeo local
- logo e favicon oficiais da Divulgador Inteligente
- busca local e filtros por categoria
- cards image-led

O problema agora é de coerência e acabamento:
- ainda existem cores arbitrárias em classes e transparências soltas
- o hero ainda mantém um CTA superior desnecessário
- o vídeo do hero precisa ocupar melhor o frame
- a rail de categorias ainda carrega ruído textual
- a grade precisa operar com densidade maior e progressão controlada

## Goals

- Remover classes de cor arbitrárias do projeto inteiro.
- Preservar a paleta atual, apenas promovendo tudo para tokens semânticos do Tailwind CSS v4.
- Tornar o hero mais limpo e imersivo.
- Centralizar a rail de categorias e eliminar títulos auxiliares.
- Exibir a vitrine em grupos de 12 itens com ação de `Ver mais`.
- Usar 4 colunas no desktop, mantendo responsividade abaixo disso.

## Non-Goals

- Não redesenhar a paleta.
- Não alterar a lógica de API, cupons ou carrinho.
- Não trocar a narrativa textual principal do hero.
- Não introduzir paginação tradicional por páginas numeradas.

## Approved Direction

### 1. Semantic Theme System

Todo uso de cor do projeto deve sair de tokens semânticos expostos no `@theme`.

Isso inclui:
- superfícies
- bordas
- foregrounds
- estados ativos e hover
- vidros translúcidos
- overlays do hero
- textos claros sobre mídia
- tratamentos suaves de contadores e pills

Classes como `white/24`, `white/88`, `white/10` e equivalentes deixam de existir nos componentes. Transparências e camadas de vidro passam a ser nomeadas no `globals.css` e consumidas por classes semânticas.

### 2. Hero Cleanup

O CTA `Explorar vitrine` sai do topo do hero.

O topo passa a ter somente:
- logo oficial da empresa

O vídeo deve ocupar visualmente todo o hero em todas as direções. A mídia continua com `object-cover`, mas ganha ajuste de escala e posicionamento para reduzir sensação de área morta. O poster acompanha o mesmo enquadramento.

Overlays e cápsulas do hero também passam a usar apenas tokens semânticos.

### 3. Category Rail Cleanup

A seção de categorias perde os títulos auxiliares.

O bloco fica reduzido à rail de pills, centralizada horizontalmente e com leitura mais limpa. Os botões continuam exibindo nome e contagem.

### 4. Product Grid And Progressive Reveal

A grade passa a operar com:
- 4 colunas no desktop
- menos colunas em breakpoints menores

A lista não exibe todos os itens de uma vez. O comportamento aprovado é:
- carregar 12 itens inicialmente
- liberar mais 12 por clique em `Ver mais`
- ao mudar busca ou categoria, resetar o limite para os primeiros 12 resultados filtrados

Paginação tradicional foi descartada porque deixaria a vitrine com aparência mais técnica e menos editorial.

## Component-Level Impact

- `app/globals.css`
  - consolida os tokens semânticos do projeto inteiro
- `components/storefront/storefront-header.tsx`
  - remove o CTA superior
  - usa apenas tokens semânticos
- `components/storefront/storefront-hero-media.tsx`
  - ajusta escala/posição da mídia para full-bleed mais convincente
- `components/catalog/category-filter.tsx`
  - remove títulos auxiliares
  - centraliza a rail
- `components/storefront/storefront-client.tsx`
  - controla o estado local do reveal progressivo
  - reseta a quantidade visível quando os filtros mudam
- `components/catalog/product-grid.tsx`
  - ajusta a grade para 4-up no desktop
  - incorpora o CTA de `Ver mais` ou recebe o recorte já aplicado

## State And Behavior

Estado local adicional:
- `visibleCount`, iniciado em `12`

Regras:
- `visibleProducts = filteredProducts.slice(0, visibleCount)`
- `Ver mais` incrementa `visibleCount` em `12`
- mudanças em `searchQuery` ou `selectedCategory` resetam `visibleCount` para `12`
- o botão só aparece quando houver mais resultados do que o recorte visível

## Testing Requirements

Cobrir:
- ausência do CTA superior do hero
- presença do logo oficial no hero
- favicon oficial no metadata
- ausência de classes arbitrárias de cor nos componentes principais afetados
- reset de `Ver mais` ao mudar busca ou categoria
- grade responsiva preparada para 4 colunas no desktop

## Risks

- remover classes arbitrárias de forma parcial cria inconsistência visual; a limpeza precisa ser global de verdade
- fazer o reveal progressivo sem reset de filtros produz estado confuso
- ajustar o vídeo sem revisar o poster pode gerar inconsistência visual no fallback

## Acceptance Criteria

- não há classes de cor arbitrárias nos componentes do projeto
- o hero não mostra mais o botão superior
- o vídeo do hero ocupa o frame com leitura full-bleed convincente
- a rail de categorias fica centralizada e sem textos auxiliares
- a grade mostra 4 colunas no desktop
- a vitrine exibe 12 itens por vez com `Ver mais`
- filtros resetam corretamente a quantidade visível
