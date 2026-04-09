# Home Bootstrap Loading Design

Date: 2026-04-09

## Goal

Criar uma experiência de loading inicial premium para a home, com:

- fundo azul `brand-primary`
- logo atual centralizada
- copy curta abaixo da logo
- barra de progresso orientada pelo bootstrap do cliente
- fechamento em `100%` quando a primeira tela estiver pronta para exibir

O loading deve aparecer apenas no `hard reload` da home. Navegações internas e interações do catálogo não devem exibir tela cheia de loading.

## Preserved Constraints

As seguintes restrições devem ser preservadas:

- a home deve continuar com o visual atual depois que o loading sair
- o azul não deve virar fundo permanente da aplicação
- a logo deve ser usada exatamente como existe hoje
- `app/loading.tsx` não deve continuar responsável por esse comportamento
- o loading não deve reaparecer durante refresh de filtros, paginação ou navegação client-side
- a arquitetura server-first da página deve ser preservada

## Rejected Directions

### `loading.tsx` como mecanismo principal

Rejeitado porque o fallback de segmento do App Router tem semântica mais ampla do que o comportamento desejado. Ele pode reaparecer em outros momentos de navegação e não entrega bom controle sobre “apenas no hard reload”.

### Solução híbrida com fallback de segmento + overlay próprio

Rejeitada por complexidade desnecessária. Dois mecanismos de loading competindo por timing aumentam custo de manutenção e risco de comportamento inconsistente.

## Chosen Direction

### Overlay client-side de bootstrap da home

A solução escolhida é um overlay full-screen controlado pelo bootstrap inicial da própria home.

Essa solução permite:

- exibir o loading somente no bootstrap inicial
- controlar o progresso de forma coerente com o estado real do cliente
- evitar tela branca antes do CSS e antes da hidratação
- remover totalmente o loading full-screen durante navegação interna

## UX Concept

### Initial Visual State

- documento entra imediatamente em estado transitório sem branco
- overlay cobre a viewport inteira
- fundo em `brand-primary`
- logo atual centralizada
- copy curta abaixo da logo
- barra horizontal de progresso abaixo da copy

### Progress Behavior

O progresso será controlado por fases do bootstrap client-side, e não por progresso exato de rede HTTP:

- `0% -> 20%`: documento pronto e overlay montado
- `20% -> 70%`: hidratação inicial da home
- `70% -> 90%`: shell principal pronto para exibir
- `90% -> 100%`: primeiro frame estável antes de liberar a interface

Para evitar flicker em máquinas ou conexões rápidas:

- o loading terá um tempo mínimo curto de exibição
- ao atingir `100%`, a saída será curta e suave

### Exit Behavior

Quando o bootstrap inicial terminar:

- a barra chega a `100%`
- o overlay faz uma saída curta
- o estado transitório do documento é removido
- a home passa a aparecer com seu visual normal e intacto

## Technical Direction

### Document-Level Anti-Flash Strategy

O documento não será pintado de azul de forma permanente.

Em vez disso:

- `html` ou `body` receberão um estado transitório, ligado apenas ao bootstrap inicial
- esse estado servirá exclusivamente para impedir o branco antes do CSS e antes da montagem do overlay
- esse estado será removido assim que o bootstrap concluir

### Loading Ownership

O comportamento deixa de depender de `app/loading.tsx`.

O loading passa a ser responsabilidade de um componente client-side específico da experiência inicial da home, com um hook pequeno para controlar:

- progresso
- tempo mínimo de exibição
- momento de conclusão
- remoção do estado transitório do documento

### Route Scope

A experiência deve ser limitada à home inicial.

Ela não deve:

- ser disparada por navegação interna comum
- interferir em `/api/catalog`
- afetar estados de loading já existentes no catálogo
- alterar a política atual de PPR ou o fluxo server-first da página

## Implementation Surface

Arquivos esperados no escopo:

- `app/layout.tsx`
- `app/loading.tsx`
- `app/globals.css`
- `components/storefront/storefront-experience.tsx`
- novo componente para o overlay de bootstrap inicial
- novo hook para progresso de bootstrap da home
- testes de comportamento correspondentes

## Testing Strategy

Os testes devem validar:

- o loading inicial só aparece no bootstrap da home
- o overlay some quando o bootstrap conclui
- o estado transitório do documento é removido depois da saída
- a home continua renderizando sua estrutura atual depois do loading
- interações internas do catálogo não reativam o loading full-screen

Além dos testes específicos, a baseline completa do projeto deve continuar verde:

```bash
pnpm vitest run
pnpm eslint .
pnpm exec tsc --noEmit
pnpm build
```

## Acceptance Criteria

- não existe tela branca visível no `hard reload` da home
- a home exibe loading full-screen azul apenas no bootstrap inicial
- a logo atual aparece centralizada
- existe copy curta abaixo da logo
- a barra de progresso chega a `100%` antes da saída
- o loading não reaparece em navegação interna
- o loading não interfere no refresh client-side do catálogo
- o estilo permanente da home continua intacto após a saída do overlay
- `app/loading.tsx` deixa de ser o mecanismo principal desse comportamento
