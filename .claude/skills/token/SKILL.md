---
name: token
description: Convenção de uso de Design Tokens em estilos CSS. Use quando criar ou modificar estilos para substituir valores hardcoded pelos tokens corretos do Design System.
model: sonnet
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
location: managed
---

# Token

Convenção para usar Design Tokens CSS ao estilizar componentes, substituindo valores hardcoded pelos tokens do Design System em `packages/pixel/tokens/`.

---

## Quando Usar

| Situação | Ação |
| -------- | ---- |
| Criar estilos de um novo componente | Consultar o mapeamento abaixo para cada propriedade |
| Modificar estilos existentes com valores hardcoded | Substituir pelo token correspondente |
| Escolher uma cor, tamanho ou espaçamento | Selecionar o token pela semântica do contexto |

## Princípio

| Aspecto | Detalhes |
| ------- | -------- |
| Consistência | Tokens garantes que todos os componentes compartilham a mesma escala visual |
| Manutenibilidade | Mudança centralizada nos tokens atualiza todo o sistema |
| Modo escuro | Cores usam `light-dark()` internamente — usar o token já garante suporte automático |

## Mapeamento: Propriedade → Categoria de Token

| Propriedade CSS | Categoria de Token | Exemplo Correto |
| --------------- | ------------------ | --------------- |
| `color` | `--color-*` | `color: var(--color-master-dark)` |
| `background`, `background-color` | `--color-*` | `background: var(--color-master-lightest)` |
| `border-color` | `--color-*` | `border-color: var(--color-master-light)` |
| `border-width` | `--border-width-*` | `border-width: var(--border-width-thin)` |
| `border-radius` | `--border-radius-*` | `border-radius: var(--border-radius-sm)` |
| `padding`, `padding-*` | `--spacing_inset-*` | `padding: var(--spacing_inset-xs)` |
| `margin`, `margin-*` | `--spacing-*` | `margin-bottom: var(--spacing-nano)` |
| `gap`, `row-gap`, `column-gap` | `--spacing-*` | `gap: var(--spacing-nano)` |
| `font-size` | `--font-size-*` | `font-size: var(--font-size-xs)` |
| `font-family` | `--font-family-*` | `font-family: var(--font-family-base)` |
| `font-weight` | `--font-weight-*` | `font-weight: var(--font-weight-regular)` |
| `line-height` | `--line-height-*` | `line-height: var(--line-height-md)` |
| `opacity` | `--opacity-level-*` | `opacity: var(--opacity-level-medium)` |
| `box-shadow` | `--shadow-level-*` | `box-shadow: var(--shadow-level-1)` |
| `fill`, `stroke` (SVG) | `--color-*` | `fill: var(--color-primary)` |

## Regras de Escala

### Cores — Escala de Tom

Cada paleta de cor possui 5 níveis de intensidade. A intensidade define **onde** usar:

| Tom | Uso | Exemplo |
| --- | --- | ------- |
| `*-darker` | Cabeçalhos e textos com forte destaque | `color: var(--color-primary-darker)` |
| `*-dark` | Textos principais e interativos | `color: var(--color-primary-dark)` |
| `*` (base) | Botões e elementos interativos | `background: var(--color-primary)` |
| `*-light` | Ícones e destaques sutis | `color: var(--color-primary-light)` |
| `*-lighter` | Fundos de componentes | `background: var(--color-primary-lighter)` |

**Regra crítica:** nunca use um tom escuro em `background` nem um tom claro em `color` de texto.

### Paletas Disponíveis

| Paleta | Uso Semântico |
| ------ | ------------- |
| `master` | Escala de cinza — textos, bordas e fundos neutros |
| `primary` | Identidade da marca — ações principais |
| `complete` | Progresso e completude |
| `success` | Feedback positivo |
| `warning` | Avisos |
| `danger` | Erros |
| `info` | Informativo neutro |
| `menu` | Navegação em contextos escuros |
| `pure-white` / `pure-black` | Contraste absoluto apenas |

### Spacing — Externo vs Interno

| Contexto | Token | Proibição |
| -------- | ----- | --------- |
| `padding` | `--spacing_inset-*` | Nunca usar `--spacing-*` em padding |
| `margin` | `--spacing-*` | Nunca usar `--spacing_inset-*` em margin |
| `gap` | `--spacing-*` | Nunca usar `--spacing_inset-*` em gap |

## Contexto Semântico

O tipo de componente determina quais tokens são obrigatórios:

| Componente | Propriedade | Token Obrigatório |
| ---------- | ----------- | ----------------- |
| Botão interativo | `background` | `--color-primary` |
| Botão interativo | `border-radius` | `--border-radius-sm` |
| Input | `border-width` | `--border-width-thin` |
| Input | `border-radius` | `--border-radius-xs` |
| Texto de erro | `color` | `--color-danger-*` |
| Texto de sucesso | `color` | `--color-success-*` |
| Borda neutra | `border-color` | `--color-master-light` |
| Fundo principal | `background` | `--color-master-lightest` |
| Título / cabeçalho | `font-family` | `--font-family-highlight` |
| Título / cabeçalho | `font-weight` | `--font-weight-bold` |
| Texto regular | `font-family` | `--font-family-base` |
| Parágrafo | `line-height` | `--line-height-md` |

## Exceções

As propriedades abaixo **não possuem token** e podem usar valores diretos:

| Propriedade | Valores Permitidos |
| ----------- | ------------------ |
| `display`, `position`, `visibility`, `overflow` | Qualquer valor válido |
| `flex`, `flex-grow`, `flex-shrink`, `order` | Valores numéricos |
| `z-index` | Valores numéricos |
| `width`, `height` | `100%`, `auto`, `min-content`, `max-content` |
| `min-width`, `max-width` | `0`, `none`, `100%` |
| `top`, `left`, `right`, `bottom` | `0` |
| `border-style` | `solid`, `dashed`, `dotted` |
| `transition`, `animation` | Duração e timing |
| `transform` | Qualquer função de transformação |
| `cursor` | `pointer`, `default`, `not-allowed` |
| `pointer-events`, `user-select` | Qualquer valor válido |

## Proibições

| O que evitar | Razão |
| ------------ | ----- |
| `color: #000` ou `color: black` | Usar `--color-master-darkest` ou a paleta semântica (rule 024) |
| `background: #fff` ou `background: white` | Usar `--color-master-lightest` ou `--color-pure-white` (rule 024) |
| `border: 1px solid #ccc` (shorthand com valores fixos) | Separar em `border-width`, `border-style` e `border-color` usando tokens |
| `padding: 16px` | Usar `--spacing_inset-xs` — padding é espaçamento interno (rule 024) |
| `margin: 8px` | Usar `--spacing-nano` — margin é espaçamento externo (rule 024) |
| `gap: 24px` | Usar `--spacing-xxs` — gap é espaçamento externo (rule 024) |
| `font-size: 16px` | Usar `--font-size-xs` — tipografia deve usar tokens (rule 024) |
| `font-weight: 700` | Usar `--font-weight-bold` — peso tipográfico deve usar tokens (rule 024) |
| `opacity: 0.5` | Usar o `--opacity-level-*` mais próximo |
| `--spacing-*` em `padding` | Padding é interno, usar `--spacing_inset-*` |
| `--spacing_inset-*` em `margin` ou `gap` | Margin e gap são externos, usar `--spacing-*` |
| Token de cor escuro em `background` | Usar a variação `*-lighter` ou `*-lightest` |
| Token de cor claro em `color` de texto | Usar a variação `*-darker` ou `*-dark` |

## Fundamentação

- [024 - Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): valores literais em CSS são constantes mágicas, devem ser substituídos por tokens nomeados para rastreabilidade e manutenção
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): tokens reduzem complexidade cognitiva ao dar semântica explícita aos valores de estilo
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): tokens centralizam a responsabilidade de definição visual, evitando que componentes individuais tomem decisões de design
- [016 - Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): mudanças de tema ou escala visual são localizadas nos tokens, sem alterar os componentes
