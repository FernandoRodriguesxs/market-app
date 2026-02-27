---
name: getter
description: Convenção de uso de getters para tratamento de leitura de valores. Use quando criar getters que acessam membros privados com lógica de tratamento.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Getter

Convenção de uso de getters para tratamento de leitura de valores associados a membros privados.

---

## Quando Usar

Use quando criar getters que precisam tratar a leitura de um valor, sempre associados a membros privados.

## Propósito

| Responsabilidade | Descrição |
|------------------|-----------|
| Valor padrão | Atribuir valor padrão quando membro privado é nulo ou indefinido |
| Transformação | Aplicar transformação ou formatação ao valor lido |
| Inicialização lazy | Criar instância apenas quando acessada pela primeira vez |
| Validação de leitura | Retornar valor alternativo baseado em condições |

## Padrões de Implementação

| Padrão | Uso |
|--------|-----|
| Coalescência nula | Atribuir valor padrão usando operador `??=` |
| Retorno direto | Retornar valor sem transformação quando não há padrão |
| Transformação condicional | Aplicar transformação baseada em condição do valor |
| Lazy initialization | Criar instância complexa apenas no primeiro acesso |

## Relação com Membros Privados

| Regra | Descrição |
|-------|-----------|
| Sempre privado | Getter deve acessar membro privado (prefixo `#`) |
| Nunca público | Getter não deve ler propriedade pública |
| Um para um | Cada getter acessa um único membro privado |
| Nome correspondente | Nome do getter corresponde ao nome do membro privado |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Getter puro sem lógica | Viola rule 008: getter deve ter lógica de tratamento, não ser mero acesso |
| Lógica complexa | Getters devem ter lógica simples e previsível |
| Side effects | Getter não deve modificar estado ou disparar ações |
| Operações custosas | Evitar operações pesadas que tornam leitura lenta |
| Acesso a múltiplos membros | Getter deve focar em um único membro privado (rule 010) |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Coalescência nula | Usar `??=` para atribuir valor padrão de forma concisa |
| Retorno direto | Retornar valor sem transformação quando não há lógica adicional |
| Lazy initialization | Criar instâncias complexas apenas no primeiro acesso |
| Getter com setter | Sempre ter setter correspondente para o mesmo membro privado |

## Fundamentação

- [008 - Proibição de Getters e Setters Puros](../../rules/008_proibicao-getters-setters-puros.md): getters são permitidos quando têm lógica de tratamento (valor padrão, transformação, lazy initialization), proibidos quando são meros acessores diretos sem lógica
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): lógica de tratamento centralizada no getter mantém código previsível e fácil de manter
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): getter tem responsabilidade única de tratar leitura do membro privado correspondente
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): getter deve ter no máximo 15 linhas, extrair lógica complexa para métodos
