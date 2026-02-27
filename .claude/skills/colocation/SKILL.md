---
name: colocation
description: Convenção de organização de arquivos co-located. Use quando criar novos arquivos, componentes ou módulos para saber onde posicioná-los na estrutura de pastas.
model: haiku
allowed-tools: Bash, Glob, Read
user-invocable: true
location: managed
---

# Colocation

Convenção de organização de arquivos co-located.

---

## Quando Usar

Use quando criar novos arquivos, componentes ou módulos para saber onde posicioná-los na estrutura de pastas.

## Princípio

| Princípio | Descrição |
|-----------|-----------|
| Proximidade | Se dois arquivos mudam juntos, devem morar juntos |

## Hierarquia de Diretórios

### Application

| Nível | Nome | Descrição |
|-------|------|-----------|
| 1 | Context | Domínio ou área de negócio |
| 2 | Container | Agrupamento funcional |
| 3 | Component | Unidade de trabalho |

### Packages

| Categoria | Propósito |
|-----------|-----------|
| Infrastructure | Infraestrutura base (directive, dom, echo, event) |
| Utilities | Utilitários e helpers (http, middleware, mixin, router) |
| UI Components | Componentes de interface (book, artifact) |
| Design System | Tokens e design (pixel) |
| Compatibility | Polyfills e patches (polyfill) |

## Posicionamento

| Preciso criar | Onde colocar |
|---------------|--------------|
| Feature da aplicação | Application / Context ou Container |
| Código reutilizável | Packages / Categoria apropriada |
| Componente UI reutilizável | Packages / UI Components |
| Utilitário genérico | Packages / Utilities |
| Design tokens | Packages / Design System |
| Configuração de Claude | Claude Assets / Tipo apropriado |
| Configuração de projeto | Raiz do projeto |
| Scripts de automação | Raiz / scripts |

## Tipos de Claude Assets

| Tipo | Propósito |
|------|-----------|
| Skills | Convenções invocáveis |
| Commands | Ações executáveis |
| Hooks | Automações de eventos |
| Rules | Regras de governança |

## Arquivos Co-located

| Tipo de Módulo | Arquivos Relacionados |
|----------------|----------------------|
| Web Component | Classe, template, estilo, contrato, testes, stories, documentação |
| Utilitário simples | Arquivo único |
| Módulo complexo | Pasta com sub-módulos |
| Testes | Co-located com código testado ou separado por tipo |

## Critérios de Decisão

| Pergunta | Resposta Sim | Resposta Não |
|----------|--------------|--------------|
| É reutilizável? | Packages | Application |
| É parte da aplicação? | Application | Packages ou config |
| É infraestrutura? | Packages / Infrastructure | Application |
| É UI reutilizável? | Packages / UI Components | Application |
| É para Claude Code? | Claude Assets | Outro local |
| Depende de lógica de negócio? | Application | Packages |
| Usado por múltiplos contextos? | Packages | Application |

## Proibições

| O que evitar | Razão |
|--------------|-------|
| Separar arquivos relacionados | Arquivos que mudam juntos devem estar juntos (rule 016) |
| Criar estrutura profunda prematuramente | Manter simples até necessidade real (rule 022) |
| Colocar lógica de negócio em packages | Packages devem ser agnósticos de domínio |
| Misturar concerns em um diretório | Cada módulo deve ter responsabilidade única (rule 010) |

## Fundamentação

- [016 - Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): classes que mudam juntas devem estar no mesmo pacote, co-location garante que arquivos relacionados fiquem próximos facilitando manutenção
- [010 - Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): cada módulo deve ter uma única razão para mudar, organização por responsabilidade facilita identificar impacto de mudanças
- [015 - Princípio da Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): módulos em packages devem ser reutilizáveis e coesos
