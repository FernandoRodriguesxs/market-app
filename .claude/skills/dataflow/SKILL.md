---
name: dataflow
description: Convenção de comunicação entre componentes via barramento de eventos. Use quando criar fluxos de dados reativos e desacoplados entre componentes.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Dataflow

Convenção de comunicação entre componentes via barramento de eventos com transformações declarativas.

---

## Quando Usar

Use quando criar comunicação reativa entre componentes sem acoplamento direto, permitindo fluxo de dados declarativo e transformações.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Desacoplamento | Componentes não conhecem uns aos outros diretamente |
| Reatividade | Mudanças propagam automaticamente via eventos |
| Declarativo | Conexões definidas em template, não em código imperativo |
| Composição | Transformações compostas via pipeline de filtros |

## Sintaxe

```
source/event:type/sink|filter1=value1|filter2=value2
```

| Parte | Obrigatório | Descrição |
|-------|-------------|-----------|
| source | Sim | Identificador do componente emissor |
| event | Sim | Nome do evento customizado |
| type | Sim | Tipo de ação no componente receptor |
| sink | Sim | Nome do método, atributo ou setter |
| filters | Não | Transformações aplicadas ao payload |

## Source (Emissor)

| Tipo | Sintaxe | Descrição | Uso |
|------|---------|-----------|-----|
| Wildcard | * | Qualquer componente | Escutar todos os eventos daquele tipo |
| ID | #elementId | Componente específico por ID | Escutar componente único identificado por id |
| Name | elementName | Componente específico por name | Escutar componente identificado por atributo name |
| Node | element-tag | Todos componentes de um tipo | Escutar todos os elementos daquele custom element |

## Event (Evento)

| Aspecto | Descrição |
|---------|-----------|
| Nome | Nome do custom event disparado pelo emissor |
| Formato | Minúsculas com hífens ou underscores |
| Convenção | Verbos no passado indicando ação concluída |
| Exemplos | sent, clicked, changed, thinking, responded |

## Type (Tipo de Ação)

| Tipo | Descrição | Efeito |
|------|-----------|--------|
| method | Chama método no receptor | `this[sink](payload)` |
| attribute | Define atributo HTML no receptor | `this.setAttribute(sink, payload)` |
| setter | Define propriedade via setter no receptor | `this[sink] = payload` |

## Sink (Receptor)

| Tipo | Descrição |
|------|-----------|
| Método público | Nome do método a ser chamado |
| Atributo HTML | Nome do atributo a ser definido |
| Setter | Nome da propriedade com setter |
| Nomenclatura | Deve existir no componente receptor |

## Filters (Sparks)

| Filter | Parâmetros | Função | Uso |
|--------|-----------|--------|-----|
| always | value | Ignora token, retorna valor fixo | Definir valor constante |
| prop | path | Extrai propriedade do objeto | Acessar propriedade aninhada |
| inc | - | Incrementa número em 1 | Contador, índice |
| dec | - | Decrementa número em 1 | Contador regressivo |
| add | value | Adiciona valor ao número | Operações aritméticas |
| subtract | value | Subtrai valor do número | Operações aritméticas |
| equals | value | Verifica igualdade | Comparações |
| different | value | Verifica diferença | Comparações |
| gt | value | Maior que | Comparações |
| gte | value | Maior ou igual | Comparações |
| lt | value | Menor que | Comparações |
| lte | value | Menor ou igual | Comparações |
| truthy | - | Converte para booleano | Validações |
| not | - | Inverte booleano | Negação lógica |
| len | - | Retorna comprimento | Tamanho de array ou string |

## Componente meli-on

| Aspecto | Descrição |
|---------|-----------|
| Tag | `<meli-on>` |
| Propósito | Conectar dataflow ao componente pai |
| Tipo | Componente headless (sem visualização) |
| Atributo | `value` contém string de dataflow |
| Localização | Filho do componente que receberá eventos |
| Lifecycle | Conecta ao parent no connected callback |

## Pipeline de Filtros

| Aspecto | Descrição |
|---------|-----------|
| Sintaxe | Separados por pipe `|` |
| Ordem | Executam da esquerda para direita |
| Composição | Saída de um é entrada do próximo |
| Transformação | Cada filtro transforma o payload |
| Formato | `filtro=parametro` |

## Barramento de Eventos

| Aspecto | Descrição |
|---------|-----------|
| Target global | Objeto target centralizado para eventos |
| Propagação | Eventos propagam pelo barramento, não pelo DOM |
| Detail | Contém attribute (id, name), node, token |
| Matching | Regex verifica se source corresponde ao emissor |
| AbortController | Gerencia lifecycle de listeners |

## Mixin Echo

| Aspecto | Descrição |
|---------|-----------|
| Propósito | Adiciona capacidade de dataflow ao componente |
| Aplicação | Usado em composição de mixins |
| Atributo on | Observa atributo on para conexões dinâmicas |
| Dispatch | Sobrescreve dispatchEvent para enviar ao barramento |
| Controllers | Gerencia AbortControllers para cleanup |

## Exemplos de Uso

| Cenário | Dataflow |
|---------|----------|
| Chamar método ask com dados | `input/sent:method/ask` |
| Definir atributo waiting como true | `agent/thinking:attribute/waiting\|always=true` |
| Definir atributo waiting como false | `agent/responded:attribute/waiting\|always=false` |
| Adicionar item à lista | `form/submitted:method/push` |
| Extrair propriedade e chamar método | `api/loaded:method/render\|prop=data.users` |
| Navegar ao clicar | `button/click:method/go` |

## Padrões de Organização

| Padrão | Descrição |
|--------|-----------|
| Colocation | Definir meli-on junto ao componente receptor |
| Agrupamento | Agrupar dataflows relacionados |
| Comentários | Documentar propósito dos dataflows |
| Nomenclatura | Usar name em componentes para identificação clara |

## Lifecycle

| Fase | Ação |
|------|------|
| Connected | meli-on espera parent ser definido |
| Connected | Chama connectArc no parent |
| Connected | Cria AbortController e registra listener |
| Event dispatch | Emissor dispara evento no barramento |
| Event match | Receptor verifica se source corresponde |
| Transform | Aplica filtros ao payload |
| Execute | Chama método, define atributo ou setter |
| Disconnected | Aborta todos os controllers |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Dataflow entre componentes acoplados | Usar método direto se houver dependência (rule 013) |
| Lógica complexa em filtros | Filtros devem ser transformações simples e puras (rule 022) |
| Criar filtros customizados sem necessidade | Usar filtros built-in quando possível, evitar complexidade |
| Múltiplos dataflows com mesma origem e destino | Consolidar em único dataflow com filtros compostos |
| Dataflows circulares | Criar loops infinitos de eventos, design inválido |
| Usar atributo on diretamente | Preferir componente meli-on para declaratividade |
| Filtros com side effects | Filtros devem ser funções puras (rule 010) |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Name explícito | Usar atributo name para identificação semântica |
| Filtros compostos | Compor transformações complexas com pipeline |
| Documentação | Comentar propósito de cada dataflow |
| Agrupamento | Agrupar dataflows por contexto funcional |
| Teste de fluxo | Validar que eventos propagam corretamente |
| Cleanup | Confiar no disconnected para limpar listeners |

## Criação de Filtros Customizados

| Aspecto | Descrição |
|---------|-----------|
| Função | Recebe token e value, retorna transformação |
| Registro | `spark.set(name, fn)` |
| Pura | Função deve ser pura sem side effects |
| Nomeação | Nome descritivo e conciso |
| Parâmetros | Primeiro é payload, segundo é valor do filtro |

## Debugging

| Técnica | Descrição |
|---------|-----------|
| Console log no dispatchEvent | Verificar eventos sendo disparados |
| Inspecionar barramento target | Verificar listeners registrados |
| Validar regex de source | Testar correspondência de identificadores |
| Verificar name e id | Garantir que componentes têm identificação |
| Testar filtros isoladamente | Validar transformações individualmente |

## Fundamentação

- [013 - Princípio de Segregação de Interface](../../rules/013_principio-segregacao-interfaces.md): componentes se comunicam via contratos de eventos, não interfaces diretas
- [016 - Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): dataflows agrupados por contexto funcional
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): sintaxe declarativa clara e composição simples de filtros
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada filtro tem transformação única e específica
