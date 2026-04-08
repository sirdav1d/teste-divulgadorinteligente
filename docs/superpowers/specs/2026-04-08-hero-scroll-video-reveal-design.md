# Hero Scroll Video Reveal Design

Date: 2026-04-08

## Goal

Transformar a hero em uma transição orientada por scroll: no início a seção é azul com o vídeo pequeno e centralizado, e conforme o usuário desce a página o vídeo expande até se tornar o background completo da hero.

## Preserved Constraints

As mudanças manuais já feitas no `StorefrontHeader` devem ser preservadas:

- `min-h-dvh`
- largura/layout atuais do container
- logo atual
- `h1` em escada
- `Instrument` só no `h1`
- animação de entrada das palavras no carregamento

## Motion Concept

### Initial State

- fundo da hero em `brand-primary`
- vídeo dentro de um wrapper menor e centralizado
- wrapper com cantos levemente arredondados
- logo e `h1` já posicionados por cima da cena

### Scroll State

À medida que o scroll avança dentro da hero:

- o wrapper do vídeo cresce
- o vídeo se expande até ocupar o fundo inteiro da hero
- o `border-radius` reduz progressivamente

### Static Foreground

Logo e `h1` permanecem estáticos por cima da cena durante toda a transição.

## Visual Constraint

- não usar overlay azul sobre o vídeo durante a expansão

O azul deve existir como fundo inicial da hero, mas não como camada colorida aplicada sobre o vídeo.

## Technical Direction

- usar `motion/react`
- usar progresso de scroll da própria hero
- aplicar transforms no wrapper do vídeo, não no bloco de conteúdo textual
- preferir `useScroll` + `useTransform`

## Scope

- alterar `components/storefront/storefront-header.tsx`
- alterar `components/storefront/storefront-hero-media.tsx`
- criar um hook pequeno se necessário para isolar o progresso de scroll da hero

## Testing

Nenhum teste novo será adicionado, por preferência do usuário.

## Acceptance Criteria

- a hero começa com fundo azul e vídeo pequeno centralizado
- no scroll, o vídeo expande até virar o background completo
- logo e `h1` continuam fixos por cima
- não existe overlay azul sobre o vídeo
- a animação de entrada das palavras continua funcionando
- as alterações manuais já feitas hoje na hero são preservadas
