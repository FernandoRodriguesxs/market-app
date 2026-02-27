---
name: constructor
description: Convenção de estrutura do constructor em Web Components. Use quando criar ou modificar constructors de componentes customizados.
model: sonnet
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
location: managed
---

# Constructor

Convenção de estrutura do constructor em Web Components.

---

## Quando Usar

Use quando criar ou modificar constructors de componentes customizados.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Inicialização | Constructor configura apenas estrutura básica do componente |
| Simplicidade | Mínima lógica no constructor, apenas setup essencial |

## Regras Básicas

| Regra | Descrição |
|-------|-----------|
| Super primeiro | Sempre chamar super() como primeira linha |
| Shadow DOM | Criar Shadow DOM se componente tem visualização |
| Sem lógica complexa | Evitar cálculos ou operações pesadas |
| Sem acesso ao DOM | Não acessar atributos ou DOM externo |
| Síncrono | Constructor deve ser sempre síncrono |

## Tipos de Constructor

### Componente Visual

| Aspecto | Configuração |
|---------|--------------|
| Super | Chamada obrigatória |
| Shadow DOM | Criar com attachShadow |
| Mode | Sempre open |
| DelegatesFocus | true para componentes interativos |

### Componente Headless

| Aspecto | Configuração |
|---------|--------------|
| Constructor | Não definir (omitir) |
| Mixin | Usar Headless |
| Shadow DOM | Não criar |
| Propósito | Componentes de comportamento/lógica |

## DelegatesFocus

| Usar true | Usar false/omitir |
|-----------|-------------------|
| Componentes com elementos focáveis | Componentes apenas visuais |
| Botões e links | Ícones e imagens |
| Inputs e formulários | Containers passivos |
| Labels e textos interativos | Decorações |
| Containers interativos | Separadores |

## Sequência de Execução

| Ordem | Ação | Obrigatório |
|-------|------|-------------|
| 1 | Chamar super() | Sim |
| 2 | Criar Shadow DOM | Se visual |
| 3 | Operações síncronas mínimas | Opcional |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Acessar atributos no constructor | Atributos ainda não foram processados pelo attributeChanged |
| Modificar DOM externo | Componente ainda não está conectado ao DOM |
| Operações assíncronas | Constructor deve ser síncrono (rule 022) |
| Adicionar event listeners | Usar connected callback para garantir componente está no DOM |
| Lógica de negócio | Pertence aos métodos, constructor apenas inicializa estrutura (rule 010) |
| Chamadas de API | Usar connected callback ou métodos específicos |
| Constructor com mais de 15 linhas | Violar rule 007, simplificar inicialização |

## Shadow DOM Options

| Opção | Valores | Uso |
|-------|---------|-----|
| mode | open | Sempre usar open para acessibilidade |
| delegatesFocus | true/false | true para componentes interativos |

## Categorias de Componentes

| Categoria | Shadow DOM | DelegatesFocus | Exemplo |
|-----------|------------|----------------|---------|
| Interativo | Sim | Sim | Button, Link, Label |
| Container | Sim | Sim | Card, Container |
| Visual | Sim | Não | Icon |
| Comportamental | Não | N/A | On, Redirect |

## Internals API

Componentes que precisam de Custom Element Internals (states, form association) devem usar getter lazy:

```javascript
get internals() {
  return this.#internals ??= this.attachInternals()
}
```

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): constructor tem única responsabilidade de inicializar estrutura básica do componente
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): constructor simples e previsível, sem lógica complexa
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): constructor deve ter no máximo 15 linhas
