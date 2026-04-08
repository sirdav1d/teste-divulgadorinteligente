# Hero Instrument Sales Copy Design

Date: 2026-04-08

## Goal

Atualizar a hero principal para comunicar venda de forma mais direta, usando uma composição tipográfica mais marcante e reservando `Instrument` apenas para o `h1`.

## Decision

Manter a hero atual em vídeo e estrutura geral, mas substituir a copy principal por um título de três palavras em escada e um parágrafo curto com foco em conversão.

## Typography

- Carregar `Instrument Serif` via `next/font/google`
- Expor a fonte como variável CSS dedicada para display
- Aplicar `Instrument` somente no `h1` da hero
- Manter a tipografia atual do restante da interface sem alterações

## Hero Copy

### H1

O `h1` passa a ser:

- `Divulgue.`
- `Venda.`
- `Cresça.`

As três palavras ficam em linhas separadas, com composição em escada:

- primeira alinhada à esquerda
- segunda centralizada
- terceira alinhada à direita

### Supporting Copy

O parágrafo abaixo do título passa a reforçar o valor comercial da vitrine:

`Transforme links, cupons e ofertas em uma vitrine pronta para converter atenção em venda.`

## Layout

- Preservar a área de mídia, logo e slot do carrinho no topo
- Preservar a hero como bloco fullscreen
- Aplicar a composição escalonada só ao `h1`
- Não adicionar selo, eyebrow ou CTA novo acima do título
- Manter o parágrafo abaixo do `h1`, com largura controlada para leitura confortável

## Implementation Notes

- Registrar a nova fonte no `layout` ao lado das fontes já existentes
- Adicionar uma variável ou utility semântica para o display da hero
- Reestruturar o `h1` em spans/blocos para controlar o alinhamento em escada
- Ajustar tamanhos e espaçamento da hero para manter boa leitura em desktop e mobile

## Testing

- Atualizar os testes da hero que validam a copy principal
- Validar que o `h1` usa a nova composição e que o texto antigo não aparece mais

## Acceptance Criteria

- A hero exibe `Divulgue.`, `Venda.` e `Cresça.` em três linhas
- O `h1` usa `Instrument Serif`
- O restante da aplicação continua com a tipografia atual
- O parágrafo da hero comunica venda/conversão com tom mais direto
- A composição continua estável em desktop e mobile
