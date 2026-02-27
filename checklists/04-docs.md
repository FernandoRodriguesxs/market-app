# Checklist: Docs

## Objetivo
Atualizar documentação (arc42, c4, bdd, adr) para manter specs/ sempre sincronizada com o código implementado.

---

## Checklist de Execução

### 1. Atualizar Arc42

#### 01. Introduction and Goals
- [ ] Adicionar nova feature aos objetivos do sistema (se aplicável)
- [ ] Atualizar stakeholders se necessário

#### 05. Building Block View
- [ ] **CRÍTICO**: Adicionar novo componente implementado
- [ ] Descrever responsabilidades do componente
- [ ] Documentar interfaces públicas
- [ ] Mapear dependências com outros componentes

#### 08. Crosscutting Concepts
- [ ] Atualizar conceitos transversais se feature introduziu novos padrões
- [ ] Documentar validações, logging, error handling (se novos)

#### 09. Architecture Decisions
- [ ] Referenciar ADRs criados para esta feature
- [ ] Listar decisões arquiteturais importantes

### 2. Atualizar Diagramas C4

#### Context Diagram
- [ ] Adicionar novos sistemas externos (se houver integrações)
- [ ] Atualizar relacionamentos entre sistema e atores

#### Container Diagram
- [ ] Adicionar novos containers (apps, databases, message queues)
- [ ] Atualizar fluxo de dados entre containers
- [ ] Documentar protocolos de comunicação

#### Component Diagram
- [ ] **CRÍTICO**: Adicionar novo componente implementado
- [ ] Desenhar relacionamentos com outros componentes
- [ ] Documentar APIs e contratos entre componentes

### 3. Criar/Atualizar BDD Features

#### Criar Nova Feature
- [ ] Criar arquivo `specs/bdd/{feature-name}.feature`
- [ ] Usar template Gherkin de `.claude/templates/bdd/feature-template.feature`

#### Estrutura do Feature File
- [ ] **Funcionalidade**: Descrição em formato "Como/Eu quero/Para que"
- [ ] **Contexto**: Setup compartilhado (se aplicável)
- [ ] **Cenário 1**: Happy path (caminho feliz)
- [ ] **Cenário 2**: Scenario Outline com múltiplos inputs (se aplicável)
- [ ] **Cenário 3**: Tratamento de erro
- [ ] **Cenário 4**: Validação de regra de negócio
- [ ] Tags: `@integration`, `@performance`, `@security` (se aplicável)

#### Validações
- [ ] Cenários seguem padrão Given-When-Then
- [ ] Linguagem de negócio (não técnica)
- [ ] Exemplos concretos em Data Tables

### 4. Criar ADR (Architecture Decision Record)

#### Quando Criar ADR
- [ ] Decisão arquitetural significativa foi tomada
- [ ] Trade-offs precisam ser documentados
- [ ] Tecnologia ou padrão foi escolhido

#### Estrutura do ADR
- [ ] Criar arquivo `specs/adr/NNNN-titulo-decisao.md`
- [ ] **Status**: Proposto | Aceito | Rejeitado | Depreciado
- [ ] **Contexto**: Qual problema estamos resolvendo?
- [ ] **Decisão**: O que decidimos fazer?
- [ ] **Consequências**: Quais são os trade-offs?
- [ ] **Alternativas Consideradas**: O que mais foi avaliado?

#### Exemplos de Decisões que Merecem ADR
- [ ] Escolha de banco de dados (SQL vs NoSQL)
- [ ] Padrão de autenticação (JWT vs Session)
- [ ] Estratégia de comunicação (REST vs GraphQL vs gRPC)
- [ ] Arquitetura de frontend (SPA vs SSR)

### 5. Atualizar Change (Opcional)
- [ ] Adicionar seção "Implementado em" com links para código
- [ ] Marcar tasks.md como concluídas
- [ ] Documentar desvios da especificação original (se houver)

### 6. Atualizar Glossário (Opcional)
- [ ] Adicionar novos termos de domínio em `specs/arc42/12-glossary.md`
- [ ] Definir siglas e acrônimos introduzidos

---

## Validações
- [ ] Arc42: Building Block View atualizado com novo componente
- [ ] C4: Component Diagram atualizado
- [ ] BDD: Feature file criada com cenários completos
- [ ] ADR: Decisões importantes documentadas
- [ ] Documentação reflete fielmente o código implementado

---

## Entregáveis
- `specs/arc42/05-building-block-view.md` atualizado
- `specs/c4/component.md` atualizado
- `specs/bdd/{feature-name}.feature` criado
- `specs/adr/NNNN-decisao.md` criado (se aplicável)

---

## Próximos Passos

### Commit e Push
Execute `/ship` para criar commit com Conventional Commits e push:
```
feat: adiciona autenticação 2FA

Implementa autenticação de dois fatores usando TOTP.
Atualiza documentação arc42, C4 e BDD.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Nova Feature
Execute `/clear` para limpar contexto e iniciar novo ciclo começando em **01. research**.
