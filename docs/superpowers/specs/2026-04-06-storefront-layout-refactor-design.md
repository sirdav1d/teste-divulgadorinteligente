# Refatoração Visual da Storefront

Data: 2026-04-06
Status: Aprovado em conversa, aguardando revisão final do documento

## Contexto

A aplicação já possui a estrutura funcional inicial da storefront:
- `app/page.tsx` server-first com busca de dados e props serializáveis
- `StorefrontClient` com busca local por nome
- componentes de catálogo, loading e erro já implementados

O problema agora não é funcional. O layout atual ainda carrega uma linguagem visual híbrida entre vitrine promocional e dashboard, enquanto a direção aprovada para esta etapa é mais sóbria, técnica e curatorial.

## Objetivo

Refatorar a linguagem visual das páginas públicas da storefront para uma direção:
- mais sóbria
- mais arejada
- mais técnica do que promocional
- com sensação de catálogo premium e arquivo curado

Essa refatoração não deve alterar a lógica de dados, os contratos atuais da página nem o comportamento já coberto pelos testes.

## Direção Escolhida

Direção validada com o usuário:
- família visual `C`: laboratório analógico
- densidade `1`: versão mais arejada, com leitura calma e alto respiro

Tradução prática dessa direção:
- base clara em tons de marfim, sálvia dessaturada e grafite
- uso contido de acentos em bronze pálido
- tipografia editorial em `Fraunces` apenas nos níveis mais altos de hierarquia
- `Geist` para corpo, interface e metadados
- visual de arquivo físico contemporâneo: divisórias finas, etiquetas discretas, grelha suave e silêncio visual

## Princípios de Design

1. O layout deve parecer curado, não promocional.
2. O espaço em branco é parte central da identidade visual.
3. Os componentes devem priorizar leitura, ritmo e clareza antes de impacto comercial.
4. Nenhuma área deve parecer “dashboard escuro” ou “card de e-commerce genérico”.
5. Estados auxiliares (`loading`, `error`, `global-error`) devem compartilhar o mesmo vocabulário visual da página principal.

## Estrutura da Página

### Header / Hero

O hero deve ser redesenhado como bloco institucional de abertura:
- manchete curta e mais precisa
- texto de apoio mais contido
- bloco lateral de estado com métricas resumidas
- menos volume decorativo
- composição mais arquitetada e menos atmosférica

Resultado esperado:
- parecer a capa de um catálogo técnico
- transmitir contexto e confiança sem parecer campanha promocional

### Coluna de Filtro

A área de busca deve funcionar como painel de filtro arquivístico:
- largura controlada
- visual limpo, com bordas finas
- presença estável no desktop, sem dominar a tela
- no mobile, deve entrar cedo no fluxo da página, mas sem parecer sidebar pesada

### Área Principal

A coluna principal deve sustentar o ritmo editorial da página:
- banner de status mais discreto, como ficha de contexto
- grid com mais respiro
- cards maiores e mais verticais
- separação clara entre contexto, listagem e estados especiais

## Componentes Afetados

### `StorefrontClient`

Responsável por:
- reorganizar a composição geral da página
- reforçar o grid mais leve e espaçado
- preservar a busca local sem alterações de comportamento

### `StorefrontHeader`

Responsável por:
- assumir a nova linguagem institucional
- reduzir o excesso de exuberância visual
- usar assimetria com moderação e foco em hierarquia tipográfica

### `SearchBox`

Responsável por:
- parecer um instrumento de filtro
- usar superfície clara, calma e precisa
- manter legibilidade e acessibilidade em todos os breakpoints

### `StatusBanner`

Responsável por:
- virar uma ficha informativa
- perder aparência de faixa de destaque
- sustentar tom técnico e silencioso

### `ProductCard`

Responsável por:
- deixar de parecer card promocional genérico
- organizar melhor metadados, imagem, preço e CTA
- aumentar sensação de peça curada e leitura premium

### `EmptyState`

Responsável por:
- sustentar presença visual sem parecer alerta exagerado
- usar linguagem elegante, limpa e consistente com o resto da página

### `loading`, `error` e `global-error`

Responsáveis por:
- compartilhar o mesmo sistema visual
- evitar tratamento visual “fallback genérico”
- parecer estados nativos da mesma aplicação

## Sistema Visual

### Paleta

Direção cromática:
- fundo principal em marfim frio
- superfícies em variações suaves de marfim e sálvia dessaturada
- texto em grafite profundo
- acentos controlados em bronze pálido e verde acinzentado

Evitar:
- blocos escuros dominantes
- degradês quentes muito dramáticos
- contraste excessivo que remeta a dashboard agressivo

### Tipografia

Uso tipográfico:
- `Fraunces` para manchetes, títulos-chave e poucos momentos de ênfase
- `Geist` para corpo, labels, busca, metadados e preços

Regra:
- a tipografia de display deve ser rara e decisiva
- o corpo precisa parecer sistema editorial, não marketing

### Superfícies e Bordas

O sistema de superfícies deve priorizar:
- bordas finas
- pouca profundidade exagerada
- sombras largas e suaves, quando necessárias
- divisórias leves e sensação de material físico organizado

### Textura e Fundo

O fundo pode incluir:
- textura quase invisível
- linhas muito sutis
- estrutura de grelha discreta

Mas não deve:
- competir com o conteúdo
- comprometer a legibilidade

## Responsividade

### Desktop

- composição em duas colunas
- grande respiro entre blocos
- hero mais largo e com leitura desacelerada

### Tablet

- redução de altura visual
- manutenção da sensação de catálogo
- simplificação do hero sem descaracterizar a identidade

### Mobile

- fluxo em coluna única
- filtro aparece cedo
- cards mantêm elegância, mas com economia de espaço
- nenhum bloco deve parecer pesado ou excessivamente ornamentado

## Movimento

Animação deve ser mínima e intencional:
- entradas suaves dos blocos principais
- hover discreto em cards
- nenhuma microinteração chamativa demais

O objetivo é sensação de refinamento, não espetáculo.

## Restrições Técnicas

Esta refatoração deve:
- preservar o modelo server-first já implementado
- manter `next/image`
- respeitar o stack atual com `Next.js 16`, `React 19` e `Tailwind 4`
- manter os testes Vitest atuais funcionando

Esta refatoração não deve:
- alterar fetching de dados
- alterar contratos de props
- introduzir nova lógica de estado além do necessário para composição visual
- modificar o comportamento funcional da busca local

## Critérios de Aceite

A refatoração estará concluída quando:
- a home transmitir claramente a linguagem “laboratório analógico arejado”
- a composição parecer mais sóbria e premium do que a versão atual
- `loading`, `error` e `global-error` estiverem visualmente alinhados com a home
- o layout funcionar bem em desktop, tablet e mobile
- os testes existentes continuarem válidos
- `lint` e `build` passarem sem regressão

## Fora de Escopo

Não fazem parte desta etapa:
- refatoração da lógica de cupons
- implementação do carrinho
- novos fluxos de navegação
- criação de novas funcionalidades de dados
- revisão textual completa do produto ou do README

## Estratégia de Execução

A implementação deve acontecer como refatoração visual incremental:
1. ajustar tokens globais e atmosfera visual
2. refatorar composição da home
3. refatorar componentes centrais da vitrine
4. alinhar estados de loading e erro
5. validar responsividade e integridade funcional
