# Checklist: Change

## Objetivo
Criar change numerada com 4 documentos estruturados (PRD, design, specs, tasks) antes de iniciar a implementação.

---

## Checklist de Execução

### 1. Criar Estrutura da Change
- [ ] Criar diretório `changes/NNN-nome-feature/` (incrementar número)
- [ ] Usar templates de `.claude/templates/changes/`

### 2. PRD.md (Product Requirements Document)
- [ ] **Executive Summary**: Resumo executivo da feature
- [ ] **Problema**: Descrição do problema a ser resolvido
- [ ] **Objetivos**: Objetivos mensuráveis (OKRs)
- [ ] **Proposta de Solução**: Como resolver o problema
- [ ] **Requisitos Funcionais**: Lista de funcionalidades (prioridade MoSCoW)
- [ ] **Requisitos Não-Funcionais**: Performance, segurança, escalabilidade
- [ ] **Stakeholders**: Quem são os envolvidos
- [ ] **Critérios de Aceite**: Como validar que foi entregue
- [ ] **Riscos**: Riscos técnicos e de negócio
- [ ] **Métricas de Sucesso**: Como medir o sucesso

### 3. design.md (Arquitetura e Decisões Técnicas)
- [ ] **Visão Geral**: Arquitetura de alto nível da solução
- [ ] **ADRs**: Decisões arquiteturais relevantes
- [ ] **Modelo de Dados**: Entidades, value objects, agregados
- [ ] **APIs**: Endpoints, contratos, payloads
- [ ] **Integrações**: Serviços externos, MCP servers
- [ ] **Segurança**: Autenticação, autorização, validação
- [ ] **Performance**: Estratégias de cache, otimização
- [ ] **Estratégia de Testes**: Unitários, integração, E2E
- [ ] **Deployment**: Como será feito o deploy
- [ ] **Monitoramento**: Logs, métricas, alertas

### 4. specs.md (Especificação Técnica Detalhada)
- [ ] **Use Cases**: Casos de uso com fluxos principais e alternativos
- [ ] **Componentes**: Lista de componentes a serem criados
- [ ] **Entidades**: Definição completa de entidades de domínio
- [ ] **Value Objects**: VOs necessários (Email, CPF, etc)
- [ ] **Events**: Eventos de domínio e integração
- [ ] **APIs Detalhadas**: Request/Response completos com exemplos
- [ ] **Database Schemas**: Estrutura de tabelas, índices, relacionamentos
- [ ] **Regras de Negócio**: Validações, cálculos, transformações
- [ ] **Fluxos de Dados**: Diagramas de sequência

### 5. tasks.md (Decomposição Atômica)
- [ ] **Teoria**: Shannon (entropia), Vaswani (context window), Liu (lost in middle)
- [ ] **Fase 1 - Setup**: Criar estrutura de pastas e arquivos base
- [ ] **Fase 2 - Domain**: Implementar entidades e value objects
- [ ] **Fase 3 - Use Cases**: Implementar casos de uso
- [ ] **Fase 4 - Infrastructure**: Repositories, adapters
- [ ] **Fase 5 - Interfaces**: APIs, controllers
- [ ] **Fase 6 - Tests**: Testes unitários e integração
- [ ] **Fase 7 - Docs**: Atualizar documentação

**Cada tarefa deve ter:**
- [ ] Complexidade ≤ 5 linhas de contexto
- [ ] Entrada e saída claramente definidas
- [ ] Zero ambiguidade (CRÍTICO para reduzir alucinações)

---

## Validações
- [ ] PRD.md cobre TODAS as 13 seções do template
- [ ] design.md cobre TODAS as 16 seções do template
- [ ] specs.md cobre TODAS as 15 seções do template
- [ ] tasks.md segue decomposição atômica (reduz alucinações 60.4% → 0.9%)

---

## Entregáveis
- `changes/NNN-feature/PRD.md` completo
- `changes/NNN-feature/design.md` completo
- `changes/NNN-feature/specs.md` completo
- `changes/NNN-feature/tasks.md` com decomposição atômica

---

## Próximos Passos
Após completar os 4 documentos, execute `/clear` e prossiga para a etapa **03. code** para implementação.
