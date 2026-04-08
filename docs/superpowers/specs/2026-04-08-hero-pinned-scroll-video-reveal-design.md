# Hero Pinned Scroll Video Reveal Design

Date: 2026-04-08

## Goal

Refinar a nova animação da hero para que:

- o vídeo inicial fique 50% menor em escala visual do que está hoje
- a hero fique pinned enquanto o scroll é consumido pela abertura do vídeo
- o scroll normal da página só continue depois que o vídeo terminar de abrir

## Preserved Constraints

As alterações manuais já feitas hoje na hero devem continuar preservadas:

- `min-h-dvh`
- largura/layout atuais do container
- logo atual
- `h1` em escada
- `Instrument` só no `h1`
- animação de entrada das palavras no carregamento
- logo e `h1` estáticos por cima da cena
- ausência de overlay azul sobre o vídeo

## Motion Concept

### Initial State

- fundo da hero em `brand-primary`
- vídeo centralizado, com cantos levemente arredondados
- vídeo com metade da escala visual inicial atual
- logo e `h1` já posicionados por cima da cena

### Pinned Scroll Phase

A hero passa a consumir o scroll enquanto o vídeo abre.

Durante essa fase:

- a hero permanece pinned
- o wrapper do vídeo cresce progressivamente
- o `border-radius` reduz progressivamente
- o vídeo se expande até ocupar o fundo completo da hero

### Exit State

Quando o vídeo atingir o estado full background:

- a transição da hero é considerada concluída
- a página volta a seguir o fluxo normal de scroll

## Technical Direction

- usar `motion/react`
- usar progresso de scroll da própria hero
- dar à hero altura extra de scroll para sustentar o pin
- aplicar transforms somente no wrapper do vídeo
- manter o conteúdo textual e a área superior como foreground estático

## Scope

- alterar `components/storefront/storefront-header.tsx`
- alterar `components/storefront/storefront-hero-media.tsx`
- ajustar ou substituir o hook de scroll reveal da hero, se necessário

## Testing

Nenhum teste novo será adicionado, por preferência do usuário.

## Acceptance Criteria

- o vídeo inicial aparece com metade do tamanho visual atual
- a hero fica pinned enquanto o vídeo abre
- o scroll da página é consumido por essa abertura
- quando o vídeo termina de abrir, o scroll normal continua
- logo e `h1` permanecem estáticos por cima
- não existe overlay azul sobre o vídeo
- a animação atual de entrada das palavras continua funcionando
