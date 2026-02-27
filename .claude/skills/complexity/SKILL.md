---
name: complexity
description: Convenção para manter complexidade ciclomática dentro do limite CC ≤ 5. Use quando escrever ou refatorar métodos que possuem lógica de controle de fluxo.
model: haiku
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
location: managed
---

# Complexity

Convenção para manter a complexidade ciclomática (CC) de métodos dentro do limite máximo de 5.

---

## Quando Usar

Use quando escrever ou refatorar métodos que contêm estruturas de controle de fluxo (`if`, `for`, `while`, `switch`, `catch`, operador ternário `?:`).

## O que é Complexidade Ciclomática

A CC conta o número de caminhos independentes através do código. Cada estrutura de controle adiciona +1 ao total. Um método sem desvios tem CC = 1.

## Regras de Contagem

| Estrutura | Pontos | Descrição |
|-----------|--------|-----------|
| `if` | +1 | Cada condicional simples |
| `else if` | +1 | Cada ramo adicional de condicional |
| `for` | +1 | Loop clássico com índice |
| `for...of` | +1 | Iteração sobre iteráveis |
| `for...in` | +1 | Iteração sobre propriedades |
| `while` | +1 | Loop com condição de entrada |
| `do...while` | +1 | Loop com condição de saída |
| `case` | +1 | Cada ramo de switch |
| `catch` | +1 | Bloco de tratamento de exceção |
| Ternário | +1 | Operador condicional inline |
| `&&` em condição | +1 | Operador lógico que cria caminho alternativo |
| `\|\|` em condição | +1 | Operador lógico que cria caminho alternativo |

## Limites

| Unidade | Limite | Ação |
|---------|--------|------|
| Método/Função | CC ≤ 5 | Obrigatório — refatorar se exceder |
| Método/Função | CC = 4–5 | Atenção — revisar se pode ser simplificado |

## Técnicas de Refatoração

| CC Alto Por | Técnica | Como Aplicar |
|-------------|---------|--------------|
| Múltiplos `if` em sequência | Guard Clauses | Retorno antecipado para cada condição (rule 002) |
| `if/else if` por tipo | Polimorfismo | Extrair comportamento por tipo em classes separadas |
| `switch` grande | Strategy | Mapa de funções por chave em vez de `switch` |
| Loop com condição interna | Extrair Método | Mover corpo do loop para método próprio |
| Lógica aninhada | Extrair Método | Quebrar em métodos menores e compostos |
| Operadores lógicos combinados | Extrair Predicado | Nomear condição composta em função separada |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| CC > 5 em qualquer método | Limite máximo da rule 022 |
| `else` ou `else if` | Usar guard clauses (rule 002) |
| Aninhamento de blocos | Manter um único nível de indentação (rule 001) |
| Método com múltiplas responsabilidades | Extrair em métodos focados (rule 010) |
| `switch` com mais de 3 cases | Substituir por mapa de funções ou polimorfismo (rule 011) |

## Fundamentação

- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): complexidade ciclomática máxima de 5 por método — critério objetivo de simplicidade
- [001 - Nível Único de Indentação](../../rules/001_nivel-unico-indentacao.md): aninhamento de blocos aumenta CC diretamente, limitando indentação controla a complexidade
- [002 - Proibição da Cláusula ELSE](../../rules/002_proibicao-clausula-else.md): cada `else if` adiciona +1 ao CC, guard clauses mantêm o fluxo linear
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): métodos com CC alto indicam múltiplas responsabilidades concentradas
- [007 - Limite Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): métodos com no máximo 15 linhas naturalmente limitam o espaço para estruturas de controle
