# Storefront Hero + Category Filter Redesign

Data: 2026-04-06
Status: Aprovado em conversa, aguardando revisão final do documento

## Contexto

A storefront já possui:
- `app/page.tsx` server-first com dados serializáveis
- busca local por nome no cliente
- grid de produtos funcional

O problema agora é estrutural e visual. A composição atual não segue mais a hierarquia desejada. A nova direção aprovada reorganiza a página em quatro blocos lineares:
1. hero section com `100vh`
2. search bar full width
3. faixa de categorias
4. lista de produtos

Além da mudança visual, a faixa de categorias precisa filtrar os produtos de verdade, junto com a busca textual já existente.

## Objetivo

Redesenhar a storefront para que a navegação principal aconteça em uma ordem clara:
- primeiro o hero
- depois a busca
- depois as categorias
- por fim o catálogo

O resultado visível deve ser sempre a combinação de:
- busca por texto
- categoria selecionada

## Decisões Aprovadas

### Estrutura

A página deve seguir esta ordem:
- `Hero section` com altura mínima de `100vh`
- `Search bar` horizontal ocupando toda a largura útil
- faixa de categorias dinâmica
- grid de produtos

### Categorias

As categorias devem ser geradas dinamicamente a partir dos produtos carregados da API.

Regras:
- incluir `Todos` como estado padrão
- incluir categorias reais encontradas nos produtos
- incluir `Outros` para agrupar itens com `category` nula, vazia ou ausente

### Comportamento de filtro

Busca textual e categoria devem funcionar juntas.

Regra final:
- lista visível = interseção entre `searchQuery` e `selectedCategory`

Exemplos:
- `Todos` + busca vazia => todos os produtos
- `Todos` + busca `"panela"` => todos os produtos com `"panela"` no título
- `kitchen` + busca vazia => todos os produtos da categoria `kitchen`
- `Outros` + busca `"kit"` => apenas itens sem categoria cujo título contém `"kit"`

## Abordagem Recomendada

A abordagem aprovada é filtrar tudo no cliente sobre a coleção já carregada.

Razões:
- mantém a interação instantânea
- evita complexidade de navegação por URL para esse caso
- não exige novos fetches
- preserva a arquitetura server-first já existente

Isso significa:
- `app/page.tsx` continua como está do ponto de vista de dados
- `StorefrontClient` continua sendo o coordenador da interação local
- os produtos base continuam vindo do server path

## Arquitetura de Estado

### Estado local necessário

`StorefrontClient` deve coordenar:
- `searchQuery`
- `selectedCategory`

### Estado derivado

Os seguintes valores devem ser derivados em render, não espelhados em `useEffect`:
- `availableCategories`
- `visibleProducts`
- `hasOtherCategory`

### Normalização de categoria

Itens sem categoria válida devem ser normalizados para um token interno estável, por exemplo:
- `others`

Categorias reais devem ser derivadas do valor vindo da API, com tratamento mínimo de apresentação:
- exibir nomes de forma legível
- manter o valor original como base do filtro

## Componentes Afetados

### `StorefrontHeader`

Passa a ser o hero principal da página.

Responsabilidades:
- ocupar `100vh`
- sustentar a abertura institucional da experiência
- apresentar o contexto principal antes de qualquer navegação de catálogo

Não deve:
- competir com a busca
- antecipar o grid de produtos visualmente

### `SearchBox`

Passa a ser um bloco horizontal full width abaixo do hero.

Responsabilidades:
- servir como entrada principal de exploração
- aparecer antes de categorias e produtos
- manter leitura clara em desktop e mobile

### Novo componente de categorias

Entrará um componente específico, por exemplo `CategoryFilter`.

Responsabilidades:
- renderizar `Todos`
- renderizar categorias reais derivadas dos produtos
- renderizar `Outros` quando necessário
- refletir visualmente a seleção atual
- disparar atualização de `selectedCategory`

### `ProductGrid`

Permanece como área final da página, mas agora subordinada a uma sequência mais clara de descoberta:
- hero
- busca
- categorias
- produtos

### `StorefrontClient`

Coordena:
- extração das categorias disponíveis
- combinação dos filtros
- ordem final dos blocos na página

## Algoritmo de Categorias

1. Ler `product.category` de cada item
2. Tratar `null`, string vazia ou ausência como `others`
3. Construir lista única de categorias reais
4. Ordenar as categorias de forma estável para a interface
5. Montar a lista final:
   - `Todos`
   - categorias reais
   - `Outros` se existir pelo menos um item sem categoria

## Algoritmo de Filtro

1. Normalizar `searchQuery`
2. Se `selectedCategory === "all"`, não filtrar por categoria
3. Se `selectedCategory === "others"`, manter apenas itens sem categoria válida
4. Caso contrário, manter apenas itens da categoria selecionada
5. Aplicar o filtro textual sobre o subconjunto resultante

## Linguagem Visual

### Hero

O hero deve ser contemplativo, forte e limpo:
- ocupar a primeira dobra
- criar uma pausa antes da navegação do catálogo
- não misturar controles com a área institucional

### Search bar

Deve parecer a principal ferramenta de exploração:
- largura total
- presença forte logo após o hero
- visual mais utilitário do que decorativo

### Faixa de categorias

Deve parecer um índice curado:
- horizontal
- leve
- com boa leitura de estados selecionado/não selecionado

Não deve parecer:
- aba pesada
- barra de navegação secundária muito rígida

### Grid de produtos

Deve entrar como etapa final da exploração, depois da escolha de intenção:
- primeiro contexto
- depois busca
- depois categoria
- depois catálogo

## Responsividade

### Desktop

- hero ocupa a tela inteira
- search bar full width abaixo da dobra
- categorias aparecem em linha ou faixa quebrável elegante
- grid abaixo

### Tablet

- hero continua dominante, mas com redução controlada de densidade
- busca continua full width
- categorias precisam continuar legíveis sem virar bloco pesado

### Mobile

- hero continua primeiro bloco, mas precisa respeitar viewport móvel real
- busca aparece cedo após o hero
- categorias devem permitir wrapping natural
- catálogo continua por último

## Restrições Técnicas

Esta mudança deve:
- preservar a lógica atual de dados
- manter a busca local no cliente
- evitar novos fetches
- continuar compatível com `Next.js 16`, `React 19` e `Tailwind 4`
- manter os testes Vitest como cobertura funcional principal

Esta mudança não deve:
- mover a categoria para a URL
- introduzir estado duplicado em `useEffect`
- depender de backend adicional
- alterar a camada de API

## Critérios de Aceite

A mudança estará concluída quando:
- a página seguir a ordem `hero -> busca -> categorias -> produtos`
- o hero ocupar `100vh`
- a busca ocupar toda a largura útil
- a faixa de categorias for dinâmica e derivada dos produtos
- `Outros` agrupar corretamente itens sem categoria
- busca e categoria filtrarem juntas
- `Todos` restaurar a coleção completa
- layout seguir íntegro em desktop, tablet e mobile

## Fora de Escopo

Não faz parte desta etapa:
- URL state para categorias
- refatoração da camada de cupons
- carrinho
- novos dados vindos do backend
- reorganização da arquitetura server-side da página

## Estratégia de Execução

A implementação deve seguir esta ordem:
1. travar os comportamentos com testes
2. adicionar o componente de categorias dinâmicas
3. mover a busca para full width
4. transformar `StorefrontHeader` em hero `100vh`
5. reorganizar a página na nova sequência
6. validar combinação de filtros e responsividade
