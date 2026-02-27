---
name: revelation
description: Convenção de estrutura de index para módulos. Use quando criar ou organizar exports de um módulo.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Revelation

Convenção de estrutura de index para módulos (Module Revelation Pattern).

---

## Quando Usar

Use quando criar ou organizar exports de um módulo.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Ponto Único de Entrada | Index.js é a única interface pública do módulo |
| Simplicidade | Apenas re-exports, sem lógica adicional |

## Regras

| Regra | Descrição |
|-------|-----------|
| Apenas re-exports | Index só contém imports e re-exports diretos |
| Sem lógica | Proibido código além de import/export |
| Sem variáveis | Proibido declarar variáveis intermediárias |

## Estrutura

| Sintaxe | Uso |
|---------|-----|
| `import 'path'` | Side-effect import |
| `export { default } from 'path'` | Re-exportar default como default |
| `export { default as Name } from 'path'` | Re-exportar default com nome |

## Exemplo

```javascript
// packages/book/button/index.js
export { default } from './button.js'
```

```javascript
// packages/book/index.js
export { default as Button } from './button/index.js'
export { default as Text } from './text/index.js'
export { default as Icon } from './icon/index.js'
```

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Lógica em index.js | Index deve ter apenas re-exports (rule 010) |
| Variáveis intermediárias | Proibido declarar variáveis, apenas import/export direto |
| Transformações no index | Lógica de transformação pertence aos módulos, não ao index |
| Index sem exports | Todo módulo deve expor interface clara |

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): index tem única responsabilidade de expor interface pública do módulo, sem lógica adicional
- [015 - Princípio da Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): módulo coeso com interface clara facilita reuso em outros contextos
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): index simples e direto é mais fácil de entender e manter
