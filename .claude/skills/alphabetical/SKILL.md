---
name: alphabetical
description: Convenção de organização de propriedades em objetos/JSON. Use quando criar ou modificar objetos para ordenar propriedades alfabeticamente.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Alphabetical

Convenção de organização de propriedades em objetos e JSON.

---

## Quando Usar

Use quando criar ou modificar objetos para ordenar propriedades alfabeticamente.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Previsibilidade | Ordem alfabética reduz custo cognitivo de localização |

## Regras

| Regra | Descrição |
|-------|-----------|
| Ordem alfabética | Propriedades devem estar em ordem alfabética (A-Z) |
| Recursivo | Objetos aninhados também seguem ordem alfabética |
| Case-sensitive | Letras minúsculas após maiúsculas (`A` antes de `a`) |

## Aplicação

| Contexto | Descrição |
|----------|-----------|
| Objetos literais | Propriedades de objetos inline |
| Arquivos JSON | Chaves em arquivos de configuração |
| Exports de módulos | Exports nomeados em index |
| Configurações | Objetos de configuração |
| CSS-in-JS | Propriedades CSS em template literals ou objetos |
| TypeScript interfaces | Propriedades de tipos e interfaces |
| Propriedades de classe | Campos e propriedades privadas ou públicas |
| Objetos de estilo | Propriedades de estilo em objetos JavaScript |

## Exceções

Não aplicar ordem alfabética quando:

| Situação | Justificativa |
|----------|---------------|
| Ordem lógica crítica | Sequência tem significado semântico (ex: coordenadas x, y, z) |
| Agrupamento semântico | Propriedades relacionadas devem permanecer juntas |
| Arrays ordenados | Ordem tem significado funcional |
| Construtores | Parâmetros seguem ordem de importância |
| APIs externas | Estrutura definida por contrato externo |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Ordenar propriedades com dependência lógica | Quando ordem tem significado semântico, mantê-la (coordenadas, sequências) |
| Forçar ordem alfabética em APIs externas | Respeitar contrato de APIs de terceiros |
| Quebrar agrupamentos coesos | Propriedades fortemente relacionadas devem permanecer juntas (rule 016) |

## Fundamentação

- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): ordem alfabética é previsível e reduz custo cognitivo ao buscar propriedades, eliminando necessidade de entender lógica de ordenação
- [006 - Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): nomes descritivos completos são mais fáceis de localizar quando ordenados alfabeticamente
- [016 - Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): propriedades que mudam juntas devem ficar agrupadas, mas dentro do grupo aplicar ordem alfabética
