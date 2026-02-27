---
name: setter
description: Convenção de uso de setters para tratamento de escrita de valores. Use quando criar setters que modificam membros privados com sincronização de estado.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Setter

Convenção de uso de setters para tratamento de escrita de valores associados a membros privados.

---

## Quando Usar

Use quando criar setters que precisam tratar a escrita de um valor, sempre associados a membros privados.

## Propósito

| Responsabilidade | Descrição |
|------------------|-----------|
| Atribuição simples | Atribuir valor ao membro privado correspondente |
| Sincronização de atributo | Sincronizar valor com atributo HTML usando decorator |
| Gatilho de re-renderização | Disparar re-renderização parcial ou total do componente |
| Validação de escrita | Aplicar transformação ou normalização antes de atribuir |

## Padrões de Implementação

| Padrão | Uso |
|--------|-----|
| Atribuição direta | Atribuir valor recebido diretamente ao membro privado |
| Com re-renderização | Usar decorator para disparar atualização visual após escrita |
| Com sincronização | Usar decorator para manter atributo HTML sincronizado |
| Com transformação | Aplicar transformação simples antes da atribuição |

## Decorators Associados

| Decorator | Função |
|-----------|--------|
| attributeChanged | Sincroniza setter com mudança de atributo HTML |
| retouch | Dispara re-renderização parcial após mudança de valor |
| repaint | Dispara re-renderização completa após mudança de valor |

## Relação com Membros Privados

| Regra | Descrição |
|-------|-----------|
| Sempre privado | Setter deve modificar membro privado (prefixo `#`) |
| Nunca público | Setter não deve modificar propriedade pública |
| Um para um | Cada setter modifica um único membro privado |
| Nome correspondente | Nome do setter corresponde ao nome do membro privado |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Setter puro sem lógica | Viola rule 008: setter deve ter lógica de tratamento (sincronização, re-renderização, transformação), não ser mera atribuição |
| Lógica de negócio complexa | Setters devem ter lógica simples de atribuição e transformação |
| Side effects não relacionados | Setter não deve modificar outros estados além do membro alvo (rule 010) |
| Validação complexa | Validações complexas devem estar em métodos de negócio |
| Modificar múltiplos membros | Setter deve focar em um único membro privado (rule 010) |
| Operações assíncronas | Setters devem ser síncronos e previsíveis |

## Relação com Getter

| Aspecto | Descrição |
|---------|-----------|
| Par obrigatório | Setter deve ter getter correspondente do mesmo membro |
| Ordem de declaração | Getter sempre antes do setter na anatomia da classe |
| Tipo consistente | Getter e setter do mesmo membro devem ter tipos compatíveis |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Atribuição simples | Setter foca em atribuir valor e disparar side effects necessários |
| Decorators | Usar @attributeChanged, @retouch ou @repaint para sincronização |
| Transformação mínima | Aplicar apenas transformações simples e diretas |
| Setter com getter | Sempre ter getter correspondente para o mesmo membro privado |

## Fundamentação

- [008 - Proibição de Getters e Setters Puros](../../rules/008_proibicao-getters-setters-puros.md): setters são permitidos quando têm lógica de tratamento (sincronização de atributo, re-renderização, transformação), proibidos quando são meras atribuições diretas sem lógica
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): lógica de tratamento centralizada no setter mantém código previsível e fácil de manter
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): setter tem responsabilidade única de tratar escrita do membro privado correspondente
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): setter deve ter no máximo 15 linhas, extrair lógica complexa para métodos
