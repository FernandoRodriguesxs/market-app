---
name: method
description: Convenção de implementação de métodos em classes. Use quando criar métodos que executam ações e devem retornar o contexto.
model: sonnet
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Method

Convenção de implementação de métodos em classes com foco em fluência e responsabilidade única.

---

## Quando Usar

Use quando criar métodos que executam ações, operações ou coordenam comportamentos em classes.

## Propósito

| Responsabilidade | Descrição |
|------------------|-----------|
| Ação de negócio | Executar operação que representa intenção de negócio |
| Coordenação | Orquestrar chamadas a outros métodos ou serviços |
| Evento | Responder a eventos do DOM ou ciclo de vida |
| Transformação | Aplicar transformação de dados ou estado |

## Regra de Retorno

| Situação | Retorno Recomendado |
|----------|---------------------|
| Método público que modifica estado | `return this` para fluent interface |
| Método com valor de retorno | Tipo específico do valor |
| Método assíncrono sem retorno | `return this` |
| Método assíncrono com retorno | Tipo específico do valor via Promise |
| Event handlers e callbacks | Opcional (pode ser `void`) |

## Justificativa do Retorno

| Benefício | Descrição |
|-----------|-----------|
| Fluent interface | Permite encadeamento de chamadas de métodos |
| Consistência | Padrão previsível em toda a base de código |
| Composição | Facilita composição de operações |
| Legibilidade | Código mais expressivo e declarativo |

## Padrões de Implementação

| Padrão | Uso |
|--------|-----|
| Método público | Métodos acessíveis externamente |
| Método com Symbol | Métodos privados ou contratos usando bracket notation |
| Método com decorator | Métodos decorados com event handlers ou lifecycle hooks |
| Método assíncrono | Métodos que executam operações assíncronas |

## Decorators Associados

| Decorator | Função |
|-----------|--------|
| on.{event} | Vincular método a evento DOM específico |
| connected | Executar método quando componente é conectado ao DOM |
| disconnected | Executar método quando componente é desconectado do DOM |
| didPaint | Executar método após renderização completa |
| before | Executar lógica antes do método principal |
| after | Executar lógica depois do método principal |
| around | Executar lógica ao redor do método principal |

## Nomenclatura

| Regra | Descrição |
|-------|-----------|
| Verbo imperativo | Nome deve iniciar com verbo que indica ação |
| Intenção clara | Nome revela o que o método faz sem necessidade de comentário |
| Específico | Evitar nomes genéricos que não expressam intenção real |
| Conciso | Nome curto mas suficientemente descritivo |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Múltiplas responsabilidades | Método deve ter uma única responsabilidade (rule 010) |
| Lógica complexa | Complexidade ciclomática máxima de 5 (rule 022) |
| Side effects ocultos | Efeitos colaterais devem ser explícitos no nome |
| Parâmetros excessivos | Máximo de 3 parâmetros por método (rule 033) |
| Método muito longo | Máximo de 15 linhas por método (rule 007) |
| Uso de else | Usar guard clauses ao invés de else (rule 002) |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Retornar this | Permitir fluent interface em métodos que modificam estado |
| Usar Symbol | Encapsular métodos privados com bracket notation |
| Nome descritivo | Verbo imperativo que revela intenção clara |
| Guard clauses | Usar early returns ao invés de else (rule 002) |
| Extrair complexidade | Métodos auxiliares para lógica complexa |

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada método tem uma única responsabilidade, expressa claramente no nome
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): métodos simples e previsíveis com complexidade ciclomática máxima de 5
- [033 - Limitação de Parâmetros de Funções](../../rules/033_limitacao-parametros-funcoes.md): máximo de 3 parâmetros para manter clareza
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): métodos com máximo de 15 linhas
- [002 - Proibição de Else](../../rules/002_proibicao-else.md): usar guard clauses para reduzir aninhamento e complexidade
