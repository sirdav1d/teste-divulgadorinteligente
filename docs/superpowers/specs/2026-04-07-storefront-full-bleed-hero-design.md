# Storefront Full Bleed Hero Design

Data: 2026-04-07
Status: Aprovado em conversa, aguardando revisao final do documento

## Context

O hero atual ja usa video local com `object-cover`, mas ainda fica preso ao container centralizado da pagina.

Isso limita o impacto visual porque:
- o video nao encosta nas bordas da viewport
- o arredondamento externo reforca leitura de card, nao de hero
- o `padding` lateral do layout impede um full-bleed real

O objetivo aprovado em conversa e transformar o topo em um hero realmente full-bleed, preservando o restante da storefront dentro do container atual.

## Goals

- Fazer o hero ocupar toda a largura disponivel da viewport.
- Manter o video cobrindo todo o frame visivel do hero.
- Garantir `min-h-svh` para leitura de tela cheia no topo.
- Preservar o catalogo, busca, filtros e grid em largura controlada abaixo da dobra.

## Non-Goals

- Nao redesenhar o catalogo abaixo do hero.
- Nao trocar o asset de video ou o poster atual.
- Nao introduzir hacks de breakout com margens negativas.
- Nao mudar o texto principal do hero nesta rodada.

## Approved Direction

### 1. Hero Outside The Centered Container

A direcao aprovada e retirar o `StorefrontHeader` do wrapper `max-w-[92rem]` em `storefront-client`.

Isso muda a estrutura para:
- hero full-bleed no topo
- conteudo do catalogo em container centralizado abaixo

Essa abordagem foi escolhida porque:
- entrega full-bleed real sem compensacoes fragis de layout
- mantem o resto da pagina estavel
- reduz risco de overflow lateral e inconsistencias responsivas

### 2. Full-Bleed Hero Shell

O elemento raiz do hero deixa de parecer um card.

Mudancas principais:
- remover `rounded-[2.75rem]` do container externo do hero
- manter `overflow-hidden`
- manter `min-h-svh`
- permitir que a midia ocupe a viewport inteira de borda a borda

O video continua absoluto com `inset-0`, `h-full`, `w-full` e `object-cover`.

### 3. Internal Content Wrapper

Mesmo com o hero full-bleed, o texto nao deve ficar solto na largura inteira da tela.

Dentro do hero, o conteudo textual continua em um wrapper interno com largura controlada, alinhado ao grid visual da pagina.

Direcao:
- usar um wrapper interno com `mx-auto w-full max-w-[92rem]`
- aplicar `px-4 sm:px-6 lg:px-8 xl:px-10` nesse wrapper interno, nao no hero externo
- manter logo, titulo, descricao e cupom nessa coluna de leitura

### 4. Page Layout Split

O `main` deixa de aplicar o `padding` horizontal global ao hero.

Em vez disso:
- o hero fica como primeiro filho full-bleed
- o bloco do catalogo passa a receber seu proprio wrapper centralizado com espacamento lateral

Isso separa claramente:
- experiencia imersiva no topo
- area funcional e contida abaixo

## Component-Level Impact

- `components/storefront/storefront-client.tsx`
  - move o `StorefrontHeader` para fora do container centralizado
  - passa a aplicar largura limitada apenas nas secoes abaixo do hero

- `components/storefront/storefront-header.tsx`
  - remove o arredondamento externo do hero
  - mantem `min-h-svh`
  - adiciona wrapper interno centralizado para o conteudo textual

- `components/storefront/storefront-hero-media.tsx`
  - preserva o preenchimento total do frame
  - permanece absoluto e full-size

## Validation

Validar:
- hero encosta nas bordas esquerda e direita da viewport
- video cobre toda a area visivel do hero sem sobrar faixas
- catalogo abaixo continua limitado ao container atual
- layout continua estavel em mobile e desktop
- `npm run lint` e `npm run build` continuam passando
