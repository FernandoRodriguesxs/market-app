# Checklist: PRD Review

## Objetivo
Validar se o PRD.md está completo e atende todos os critérios antes de prosseguir para design.md.

---

## Checklist de Validação

### 1. Executive Summary
- [ ] Resumo executivo em 2-3 parágrafos
- [ ] Descreve o problema, solução e valor de negócio
- [ ] Compreensível para stakeholders não-técnicos

### 2. Problema
- [ ] Problema está claramente definido
- [ ] Inclui contexto e motivação
- [ ] Quantifica o impacto (dados, métricas, pesquisas)
- [ ] Explica por que resolver agora (urgência)

### 3. Objetivos
- [ ] Objetivos são SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Usa formato OKR ou similar
- [ ] Cada objetivo tem métrica associada
- [ ] Alinhado com metas de negócio

### 4. Proposta de Solução
- [ ] Solução está bem descrita em alto nível
- [ ] Explica COMO resolver o problema
- [ ] Justifica por que esta abordagem (vs alternativas)
- [ ] Inclui diagramas conceituais (opcional mas recomendado)

### 5. Requisitos Funcionais
- [ ] Lista completa de funcionalidades
- [ ] Usa priorização MoSCoW:
  - **Must have**: Essencial (MVP)
  - **Should have**: Importante mas não crítico
  - **Could have**: Desejável
  - **Won't have**: Fora do escopo
- [ ] Cada requisito é verificável
- [ ] Descrições claras e sem ambiguidade

### 6. Requisitos Não-Funcionais
- [ ] **Performance**: Tempos de resposta, throughput
- [ ] **Segurança**: Autenticação, autorização, criptografia
- [ ] **Escalabilidade**: Carga esperada, crescimento
- [ ] **Disponibilidade**: SLA, uptime esperado
- [ ] **Usabilidade**: Experiência do usuário
- [ ] **Manutenibilidade**: Facilidade de manutenção
- [ ] Cada RNF tem métrica mensurável

### 7. User Stories (Opcional)
- [ ] Formato: "Como [papel], eu quero [ação], para que [benefício]"
- [ ] Critérios de aceite definidos
- [ ] Prioridade atribuída

### 8. Stakeholders
- [ ] Lista completa de stakeholders
- [ ] Papel de cada um claramente definido
- [ ] Identificado quem é:
  - Sponsor/Owner
  - Decision maker
  - Contributor
  - Informed

### 9. Cronograma (Opcional)
- [ ] Marcos principais definidos
- [ ] Estimativas de esforço (story points, dias)
- [ ] Dependências identificadas
- [ ] Datas realistas

### 10. Critérios de Aceite
- [ ] Define "Done" de forma clara e verificável
- [ ] Cobre funcionalidades principais
- [ ] Inclui aspectos de qualidade (testes, docs, performance)

### 11. Riscos e Mitigações
- [ ] Riscos técnicos identificados
- [ ] Riscos de negócio identificados
- [ ] Probabilidade e impacto avaliados
- [ ] Estratégias de mitigação definidas
- [ ] Plano de contingência (se necessário)

### 12. Dependências
- [ ] Dependências de outras equipes/projetos
- [ ] Dependências técnicas (bibliotecas, serviços)
- [ ] Dependências de dados
- [ ] Bloqueadores identificados

### 13. Métricas de Sucesso
- [ ] KPIs definidos claramente
- [ ] Métricas são mensuráveis
- [ ] Baseline (situação atual) documentado
- [ ] Target (meta) especificado
- [ ] Método de medição descrito

---

## Validações de Qualidade

### Clareza
- [ ] Linguagem simples e direta
- [ ] Sem jargões técnicos excessivos
- [ ] Compreensível para todos os stakeholders

### Completude
- [ ] Todas as 13 seções estão presentes
- [ ] Nenhuma seção está vazia ou "TBD"
- [ ] Cobre todos os aspectos do problema e solução

### Consistência
- [ ] Não há contradições entre seções
- [ ] Terminologia é consistente
- [ ] Números e métricas são coerentes

### Viabilidade
- [ ] Escopo é realista para o prazo
- [ ] Recursos necessários são disponíveis
- [ ] Dependências são gerenciáveis

---

## Checklist de Aprovação

### Revisão Técnica
- [ ] Arquiteto revisou e aprovou
- [ ] Tech Lead revisou e aprovou
- [ ] Identificou pontos que precisam de ADRs

### Revisão de Negócio
- [ ] Product Owner revisou e aprovou
- [ ] Stakeholders principais revisaram
- [ ] Alinhamento com roadmap confirmado

### Revisão de Qualidade
- [ ] QA/Test Lead revisou requisitos
- [ ] Testabilidade validada
- [ ] Estratégia de testes clara

---

## Red Flags (Sinais de Alerta)

⚠️ **Retrabalhar PRD se:**
- [ ] Problema não está claro ou muito vago
- [ ] Objetivos não são mensuráveis
- [ ] Requisitos são ambíguos ("sistema deve ser rápido")
- [ ] Nenhum risco identificado (todo projeto tem riscos)
- [ ] Métricas de sucesso ausentes
- [ ] Cronograma irrealista
- [ ] Stakeholders não foram consultados

---

## Entregável
✅ PRD aprovado e pronto para design.md

---

## Próximos Passos
Após aprovação do PRD, prossiga para criação de `design.md` (arquitetura e decisões técnicas).
