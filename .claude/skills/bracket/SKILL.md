---
name: bracket
description: Convenção de Symbol para métodos privados e contratos. Use quando criar métodos que precisam de decorators ou definir interfaces para mixins.
model: sonnet
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Bracket

Convenção de Symbol para métodos privados e contratos de interface.

---

## Quando Usar

Use quando criar métodos que precisam de decorators ou definir interfaces para mixins.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Encapsulamento | Symbol cria chaves únicas e privadas para métodos e contratos |
| Extensibilidade | Permite definir contratos de interface sem conflitos de nomes |

## Regras

| Regra | Descrição |
|-------|-----------|
| Ownership | O módulo dono do conceito define o Symbol |
| Localidade | Preferir `Symbol()` local a `Symbol.for()` global |
| Exportação | Exportar apenas Symbols que são contratos públicos |

## Estrutura

| Arquivo | Propósito |
|---------|-----------|
| `interfaces.js` | Exporta Symbols do módulo |

## Tipos

| Tipo | Sintaxe | Uso |
|------|---------|-----|
| Local | `Symbol('name')` | Privado ao módulo |
| Global | `Symbol.for('name')` | Compartilhado via registry |

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Callback | `verbCallback` | `didPaintCallback` |
| Ação | `verbNoun` | `connectArc` |
| Capacidade | `adjective` | `hideable` |
| Recurso | `noun` | `controller` |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Usar Symbol.for() sem necessidade | Symbol local é mais seguro, usar global apenas para contratos cross-module |
| Symbol sem descrição | Dificulta debugging, sempre passar string descritiva |
| Exportar Symbols privados | Expor apenas contratos públicos de interface (rule 013) |
| Nomes genéricos em Symbols | Usar nomes descritivos que revelam intenção (rule 006) |

## Fundamentação

- [008 - Proibição de Getters/Setters Puros](../../rules/008_proibicao-getters-setters-puros.md): Symbol permite encapsulamento verdadeiro ao invés de getters/setters para acesso a métodos internos
- [013 - Princípio de Segregação de Interface](../../rules/013_principio-segregacao-interfaces.md): contratos específicos via Symbol permitem interfaces granulares e desacopladas
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada Symbol representa um único contrato ou comportamento
