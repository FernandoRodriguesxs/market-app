---
name: story
description: Convenção de estrutura de stories para Storybook. Use quando criar ou atualizar stories de componentes.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Story

Convenção de estrutura de stories para Storybook.

---

## Quando Usar

Use quando criar ou atualizar stories de componentes.

## Estrutura

| Elemento | Propósito |
|----------|-----------|
| Import | Importar componente no topo |
| Export default | Configuração do Storybook |
| Export Default | Story padrão com args básicos |

## Configuração

| Propriedade | Descrição |
|-------------|-----------|
| title | Caminho no menu de navegação |
| tags | Tags para geração de documentação |
| parameters | Configurações de apresentação |
| argTypes | Definição de controles e documentação |
| render | Função de renderização do componente |

## ArgTypes

| Campo | Propósito |
|-------|-----------|
| control | Tipo de controle na UI |
| options | Opções disponíveis para seleção |
| description | Documentação do atributo |
| table | Metadados e valores padrão |

## Tipos de Controle

| Tipo | Uso |
|------|-----|
| select | Seleção entre opções pré-definidas |
| text | Entrada de texto livre |
| boolean | Alternância verdadeiro/falso |
| number | Entrada numérica |
| color | Seletor de cores |

## Regras

| Regra | Descrição |
|-------|-----------|
| Formato arquivo | Usar JavaScript, não TypeScript |
| Exports | Uma única story Default por arquivo |
| Testes | Sem play functions ou testes de interação |
| Controles | Desabilitar controles globais |
| Imports | Sempre importar componente no início |
| Renderização | Criar elemento via DOM API |

## Princípios

| Princípio | Aplicação |
|-----------|-----------|
| Simplicidade | Story deve mostrar uso básico do componente |
| Isolamento | Cada story é independente |
| Documentação | ArgTypes documentam comportamento |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Multiple stories no mesmo arquivo | Uma única story Default por arquivo (rule 010) |
| Play functions ou testes | Stories são para visualização, não testes |
| Lógica complexa no render | Manter render simples e direto (rule 022) |
| Controles não documentados | Todos os argTypes devem ter description |
| Stories sem exemplo real | Mostrar casos de uso reais do componente |

## Fundamentação

- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): stories simples focam no essencial, reduzindo complexidade cognitiva
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada story tem uma única responsabilidade de demonstrar um caso de uso do componente
- [026 - Qualidade de Comentários](../../rules/026_qualidade-comentarios-porque.md): documentação via argTypes é permitida pois explica "o que" o argumento faz, não código
