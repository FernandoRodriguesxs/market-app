# Checklist: Research

## Objetivo
Pesquisar documentação existente antes de criar uma nova feature para entender o contexto arquitetural e as decisões já tomadas.

---

## Checklist de Execução

### 1. Documentação Arc42
- [ ] Ler `specs/arc42/01-introduction-and-goals.md` para entender objetivos do sistema
- [ ] Consultar `specs/arc42/03-system-scope-and-context.md` para identificar integrações
- [ ] Verificar `specs/arc42/05-building-block-view.md` para componentes existentes
- [ ] Revisar `specs/arc42/04-solution-strategy.md` para padrões arquiteturais

### 2. Diagramas C4
- [ ] Analisar `specs/c4/contexto.md` para entender o sistema e seus vizinhos
- [ ] Estudar `specs/c4/container.md` para identificar apps e databases
- [ ] Verificar `specs/c4/component.md` para módulos internos relacionados

### 3. Decisões Arquiteturais (ADRs)
- [ ] Listar todos os ADRs em `specs/adr/`
- [ ] Identificar decisões relacionadas à feature que será implementada
- [ ] Verificar se há restrições ou padrões definidos que devem ser seguidos

### 4. BDD Features
- [ ] Buscar features relacionadas em `specs/bdd/`
- [ ] Identificar cenários de teste existentes que podem ser afetados
- [ ] Verificar padrões de escrita de cenários Gherkin utilizados

### 5. Estrutura de Código
- [ ] Mapear a estrutura `src/` seguindo hierarchy context/container/component
- [ ] Identificar módulos existentes que podem ser reutilizados
- [ ] Verificar convenções de nomenclatura e organização de arquivos

---

## Entregáveis
- Lista de arquivos relevantes consultados
- Resumo das decisões arquiteturais que impactam a feature
- Identificação de componentes existentes que podem ser reutilizados
- Mapeamento de integrações e dependências

---

## Próximos Passos
Após completar o research, execute `/clear` e prossiga para a etapa **02. change** para criar a documentação da mudança.
