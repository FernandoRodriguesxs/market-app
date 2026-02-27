---
name: mixin
description: Convenção de uso de mixins para composição de comportamentos em Web Components. Use quando criar ou modificar componentes que precisam de funcionalidades reutilizáveis.
model: sonnet
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
location: managed
---

# Mixin

Convenção de uso de mixins para composição de comportamentos.

---

## Quando Usar

Use quando criar ou modificar componentes que precisam de funcionalidades reutilizáveis.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Composição | Adicionar comportamentos através de composição, não herança |
| Reutilização | Compartilhar funcionalidades entre componentes diferentes |

## Mixins Disponíveis

| Mixin | Propósito | Funcionalidade |
|-------|-----------|----------------|
| Align | Alinhamento | Controla alinhamento do conteúdo |
| Color | Coloração | Gerencia esquema de cores do componente |
| Disabled | Desabilitação | Adiciona estado desabilitado |
| Headless | Invisibilidade | Remove visualização do componente |
| Height | Altura | Controla dimensão vertical |
| Hidden | Visibilidade | Gerencia visibilidade do componente |
| Reaval | Revelação | Comportamento de scroll automático |
| Width | Largura | Controla dimensão horizontal |

## Aplicação

| Aspecto | Descrição |
|---------|-----------|
| Ordem | Aplicados da direita para esquerda |
| Base | Sempre começar com classe base (HTMLElement ou Echo) |
| Encadeamento | Envolver classes em sequência lógica |
| Herança | Mixin recebe classe e retorna classe estendida |

## Categorias de Mixins

| Categoria | Mixins | Uso |
|-----------|--------|-----|
| Layout | Width, Height, Align | Dimensionamento e posicionamento |
| Estado | Disabled, Hidden | Controle de estado do componente |
| Aparência | Color | Estilização visual |
| Comportamento | Headless, Reaval | Funcionalidades especiais |

## Seleção de Mixins

| Necessidade | Mixin Recomendado |
|-------------|-------------------|
| Controle de largura responsiva | Width |
| Controle de altura responsiva | Height |
| Desabilitar interação | Disabled |
| Ocultar componente | Hidden |
| Remover renderização | Headless |
| Aplicar tema de cores | Color |
| Alinhar conteúdo | Align |
| Auto-scroll ao aparecer | Reaval |

## Regras

| Regra | Descrição |
|-------|-----------|
| Echo obrigatório | Echo deve estar na cadeia para eventos funcionarem |
| Ordem importa | Aplicação segue ordem direita-esquerda |
| Campos privados | Mixins usam campos privados para estado interno |
| Getters/Setters | Propriedades expostas via getter/setter |
| AttributeChanged | Sincronização com atributos HTML |
| Internals | Mixins podem usar Custom Element internals |

## Combinações Comuns

| Tipo de Componente | Combinação Sugerida |
|-------------------|---------------------|
| Botão interativo | Disabled, Width, Hidden, Echo |
| Texto estilizado | Color, Align, Hidden, Echo |
| Container layout | Width, Height, Hidden, Echo |
| Componente invisível | Headless, Echo |
| Card responsivo | Width, Hidden, Echo |

## Características dos Mixins

| Característica | Descrição |
|----------------|-----------|
| Não invasivos | Não modificam comportamento existente |
| Composíveis | Podem ser combinados livremente |
| Isolados | Cada mixin tem responsabilidade única |
| Reativos | Respondem a mudanças de atributos |
| Testáveis | Podem ser testados isoladamente |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Mixin sem Echo na cadeia | Echo é obrigatório para sistema de eventos funcionar |
| Ordem incorreta de aplicação | Ordem importa, lembrar que aplica direita-esquerda |
| Mixin com múltiplas responsabilidades | Cada mixin deve ter responsabilidade única (rule 010) |
| Duplicar lógica de mixins | Usar mixins existentes ao invés de recriar comportamento (rule 021) |
| Mixins com acoplamento | Mixins devem ser independentes e composíveis |

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada mixin tem uma única responsabilidade
- [016 - Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): comportamentos relacionados encapsulados juntos
- [021 - Proibição da Duplicação de Lógica](../../rules/021_proibicao-duplicacao-logica.md): mixins eliminam duplicação de comportamentos
