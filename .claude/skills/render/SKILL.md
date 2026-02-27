---
name: render
description: Convenção de renderização e re-renderização de componentes. Use quando criar componentes visuais e otimizar atualizações de DOM.
model: haiku
allowed-tools: Read, Write, Edit
user-invocable: true
location: managed
---

# Render

Convenção de renderização e re-renderização de componentes com foco em performance e otimização.

---

## Quando Usar

Use quando criar componentes visuais que precisam renderizar HTML e CSS, ou quando precisar re-renderizar componentes após mudanças de estado.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Performance | Minimizar operações de DOM escolhendo estratégia adequada |
| Reatividade | Re-renderizar apenas quando necessário e de forma otimizada |

## Decorators de Renderização

| Decorator | Escopo | O que renderiza | Performance | Uso |
|-----------|--------|-----------------|-------------|-----|
| paint | Classe | HTML + CSS inicial | N/A | Renderização inicial no connected |
| repaint | Setter/Método | HTML + CSS completo | Custoso | Mudanças que afetam template HTML |
| retouch | Setter/Método | Apenas CSS | Otimizado | Mudanças que afetam apenas estilos |

## Paint (Renderização Inicial)

| Aspecto | Descrição |
|---------|-----------|
| Aplicação | Decorator de classe |
| Parâmetros | Função component e função style |
| Execução | Quando componente é conectado ao DOM |
| Frequência | Uma única vez no ciclo de vida |
| Lifecycle | Executa no connected callback |

## Repaint (Re-renderização Completa)

| Aspecto | Descrição |
|---------|-----------|
| Aplicação | Decorator de setter ou método |
| O que faz | Re-renderiza HTML e CSS |
| Callbacks | willPaint → html + css → didPaint |
| Assíncrono | Usa setImmediate para não bloquear |
| Guarda | Verifica isPainted antes de executar |
| Custo | Alto - re-processa template e estilos |

## Retouch (Re-renderização Parcial)

| Aspecto | Descrição |
|---------|-----------|
| Aplicação | Decorator de setter ou método |
| O que faz | Re-renderiza apenas CSS |
| Callbacks | Apenas cssCallback |
| Assíncrono | Usa setImmediate para não bloquear |
| Guarda | Verifica isPainted antes de executar |
| Custo | Baixo - apenas recalcula estilos |

## Quando Usar Cada Decorator

| Situação | Decorator | Justificativa |
|----------|-----------|---------------|
| Mudança de src, use, fallback | repaint | Conteúdo HTML muda |
| Mudança de color, size, variant | retouch | Apenas estilos mudam |
| Mudança de texto interno | repaint | Template HTML muda |
| Mudança de classe CSS | retouch | Apenas estilos mudam |
| Mudança de visibilidade | retouch | Apenas display/opacity muda |
| Adição/remoção de elementos | repaint | Estrutura DOM muda |
| Método que limpa formulário | repaint | Inputs precisam ser re-renderizados |
| Método que muda tema | retouch | Apenas variáveis CSS mudam |

## Otimização de Performance

| Estratégia | Descrição |
|-----------|-----------|
| Preferir retouch | Usar retouch sempre que mudança for apenas de estilo |
| Evitar repaint desnecessário | Não usar repaint quando retouch é suficiente |
| Batching automático | setImmediate agrupa múltiplas atualizações |
| Guarda de estado | isPainted previne renderização antes de conectado |
| Assíncrono | Não bloqueia thread principal |

## Lifecycle de Renderização

| Fase | Callback | Função |
|------|----------|--------|
| Antes | willPaintCallback | Preparação antes de renderizar |
| HTML | htmlCallback | Re-renderiza template HTML |
| CSS | cssCallback | Re-renderiza estilos CSS |
| Depois | didPaintCallback | Finalização após renderizar |

## Uso em Setters

| Padrão | Descrição |
|--------|-----------|
| Ordem de decorators | attributeChanged primeiro, depois repaint ou retouch |
| Setter com repaint | Quando valor afeta template HTML |
| Setter com retouch | Quando valor afeta apenas estilos |
| Múltiplos decorators | Permitido empilhar decorators |

## Uso em Métodos

| Padrão | Descrição |
|--------|-----------|
| Métodos públicos | Podem ter repaint ou retouch |
| Métodos com Symbol | Métodos privados podem ter decorators de render |
| Event handlers | Podem disparar re-renderização |
| Métodos assíncronos | Compatível com repaint e retouch |

## Component e Style

| Função | Retorno | Parâmetro | Descrição |
|--------|---------|-----------|-----------|
| component | Template html | Instância do componente | Retorna estrutura HTML do componente |
| style | Template css | Instância do componente | Retorna estilos CSS do componente |

## Reatividade

| Aspecto | Descrição |
|---------|-----------|
| Valores dinâmicos | Component e style acessam propriedades da instância |
| Condicional | Renderização pode usar lógica condicional simples |
| Interpolação | Valores interpolados são recalculados em cada render |
| Closure | Funções capturam contexto da instância |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Usar repaint quando retouch basta | Desperdício de performance |
| Re-renderizar no constructor | Componente ainda não está conectado |
| Lógica complexa em component/style | Manter funções simples (rule 010) |
| Side effects em component/style | Funções devem ser puras |
| Renderização síncrona bloqueante | Usar decorators que são assíncronos |
| Múltiplos repaints em sequência | Deixar batching automático agrupar |

## Boas Práticas

| Prática | Descrição |
|---------|-----------|
| Análise de impacto | Avaliar se mudança afeta HTML ou apenas CSS |
| Preferir retouch | Default para retouch, usar repaint apenas se necessário |
| Funções puras | component e style devem ser funções puras |
| Minimal logic | Manter lógica de renderização simples |
| Single responsibility | Cada render tem único propósito |
| Lazy rendering | Componente renderiza apenas quando conectado |

## Casos Especiais

| Caso | Tratamento |
|------|-----------|
| Componente headless | Não usar paint (sem renderização visual) |
| Apenas lógica | Componentes comportamentais não precisam de render |
| Lazy rendering | Componente renderiza apenas quando conectado |
| Conditional rendering | Usar lógica condicional em component |

## Fundamentação

- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada render tem responsabilidade específica e clara, paint para inicial, repaint para HTML+CSS, retouch apenas para CSS
- [022 - Priorização da Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): escolher decorator adequado (paint/repaint/retouch) torna intenção clara e mantém performance
- [020 - Otimização Prematura](../../rules/020_otimizacao-prematura.md): otimizar escolhendo retouch vs repaint baseado em necessidade real, não prematuro
- [007 - Restrição de Linhas em Classes](../../rules/007_restricao-linhas-classes.md): funções component e style devem ter no máximo 15 linhas
