---
name: event
description: Convenção de uso de eventos DOM e custom events. Use quando criar event handlers e comunicação entre componentes.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Event

Convenção de uso de eventos DOM e custom events para interatividade e comunicação entre componentes.

---

## Quando Usar

Use quando criar event handlers que respondem a interações do usuário ou quando componentes precisam comunicar mudanças de estado.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Comunicação desacoplada | Componentes se comunicam via eventos sem dependência direta |
| Reatividade | Componentes reagem a mudanças através de listeners |

## Decorator de Eventos

| Aspecto | Descrição |
|---------|-----------|
| Sintaxe | `@on.{eventType}` |
| Tipos comuns | click, submit, input, keydown, change |
| Seletor | Primeiro parâmetro opcional para filtrar elemento alvo |
| Modificadores | Parâmetros adicionais para alterar comportamento do evento |
| Método alvo | Método decorado recebe evento ou dado transformado |

## Estrutura do Decorator

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| Seletor | String | Não | Seletor CSS para filtrar elemento alvo dentro do Shadow DOM |
| Modificadores | Function | Não | Funções que modificam evento antes de passar ao handler |

## Modificadores Disponíveis

| Modificador | Função | Uso |
|-------------|--------|-----|
| prevent | Previne comportamento padrão | Evitar submit de formulário, navegação de link |
| stop | Interrompe propagação do evento | Evitar que evento suba na árvore DOM |
| enter | Filtra apenas tecla Enter | Executar ação ao pressionar Enter |
| formData | Extrai dados de formulário | Transforma FormData em objeto |
| value | Extrai valor do target | Passa apenas o valor do elemento |
| detail | Extrai detail de CustomEvent | Acessa dados customizados do evento |

## Ordem de Aplicação

| Ordem | Elemento |
|-------|----------|
| 1 | Tipo de evento |
| 2 | Seletor (opcional) |
| 3 | Modificadores (opcional, múltiplos permitidos) |

## Custom Events

| Aspecto | Descrição |
|---------|-----------|
| Criação | Usar função customEvent do pacote @event |
| Tipo | String identificadora do evento |
| Detail | Dados associados ao evento |
| Bubbles | Sempre true para permitir propagação |
| Cancelable | Sempre true para permitir prevenção |

## Dispatch de Eventos

| Aspecto | Descrição |
|---------|-----------|
| Método | `this.dispatchEvent()` |
| Contexto | Chamado no componente que emite o evento |
| Propagação | Evento sobe pela árvore DOM até ser capturado |
| Timing | Dispatch é síncrono, handlers executam imediatamente |

## Tipos de Eventos

| Categoria | Eventos | Uso |
|-----------|---------|-----|
| Mouse | click, dblclick, mousedown, mouseup | Interações com mouse |
| Teclado | keydown, keyup, keypress | Interações com teclado |
| Formulário | submit, change, input, reset | Manipulação de formulários |
| Foco | focus, blur, focusin, focusout | Gerenciamento de foco |
| Custom | Nomes personalizados | Comunicação entre componentes |

## Nomenclatura de Custom Events

| Regra | Descrição |
|-------|-----------|
| Minúsculas | Usar apenas letras minúsculas |
| Descritivo | Nome deve descrever o que aconteceu |
| Verbos no passado | Indica ação concluída (sent, clicked, changed) |
| Namespace | Usar prefixo para eventos de domínio específico |

## Event Handlers

| Aspecto | Descrição |
|---------|-----------|
| Retorno | Retornar this para manter fluent interface |
| Assincronia | Pode ser async se necessário |
| Parâmetro | Recebe evento ou dado transformado por modificador |
| Nome | Usar Symbol via bracket notation para encapsulamento |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Event listeners no constructor | Constructor não deve acessar DOM (rule constructor) |
| Manipulação direta do DOM externo | Violar encapsulamento do Shadow DOM |
| Lógica complexa no handler | Extrair para métodos auxiliares (rule 010) |
| Side effects não explícitos | Handler deve ter responsabilidade clara |
| Modificar evento original | Modificadores devem retornar novo valor, não mutar |
| Múltiplas responsabilidades | Um handler por ação (rule 010) |


## Seletores

| Tipo | Descrição |
|------|-----------|
| Tag | Nome do elemento HTML |
| Classe | Seletor de classe CSS |
| ID | Seletor de ID |
| Atributo | Seletor de atributo |
| Wildcard | Asterisco para qualquer elemento |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Usar Symbol para handlers | Encapsular métodos de evento com bracket notation |
| Combinar decorators | Empilhar múltiplos decorators quando necessário |
| Modificadores primeiro | Aplicar modificadores antes de lógica de negócio |
| Eventos nomeados | Criar constantes/enum para nomes de eventos custom |
| Detail estruturado | Usar objetos com propriedades nomeadas no detail |

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada handler tem uma única responsabilidade, não misturar múltiplas ações em um handler
- [013 - Princípio de Segregação de Interface](../../rules/013_principio-segregacao-interfaces.md): eventos permitem comunicação sem acoplamento direto, componentes interagem via contratos de eventos
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): handlers simples e modificadores composíveis mantêm código previsível
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): event handlers devem ter máximo de 15 linhas
