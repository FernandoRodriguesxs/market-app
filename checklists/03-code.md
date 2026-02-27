# Checklist: Code

## Objetivo
Implementar a feature seguindo estrutura context/container/component, respeitando as 51 regras arquiteturais e 18 skills de código.

---

## Checklist de Execução

### 1. Criar Estrutura de Pastas
- [ ] Seguir hierarquia: `src/{context}/{container}/{component}/`
- [ ] Context = domínio de negócio (ex: `user`, `order`, `notification`)
- [ ] Container = agregador lógico (ex: `authentication`, `cart`, `in-app`)
- [ ] Component = funcionalidade específica (ex: `login`, `register`, `checkout`)

### 2. Implementar Value Objects
- [ ] Seguir regra **003**: Encapsulamento de Primitivos
- [ ] Criar VOs imutáveis (Email, CPF, UserId, etc)
- [ ] Validação no construtor (falha rápida)
- [ ] Usar `Object.freeze()` (regra **029**)

### 3. Implementar Entidades de Domínio
- [ ] Seguir regra **010**: SRP (Single Responsibility Principle)
- [ ] Máximo 50 linhas por classe (regra **007**)
- [ ] Métodos com CC ≤ 5 (regra **022** - KISS)
- [ ] Usar apenas skills definidas (alphabetical, anatomy, complexity, etc)
- [ ] Proibido getters/setters puros (regra **008**)
- [ ] Aplicar "Tell, Don't Ask" (regra **009**)

### 4. Implementar Use Cases
- [ ] Seguir DIP - Inversão de Dependência (regra **014**)
- [ ] Injeção de dependências via construtor
- [ ] Máximo 3 parâmetros por método (regra **033**)
- [ ] Sem boolean flags (regra **037**)
- [ ] Aplicar CQS - Command-Query Separation (regra **038**)

### 5. Implementar Repositories/Adapters
- [ ] Seguir ISP - Interface Segregation (regra **013**)
- [ ] Interfaces com máximo 5 métodos
- [ ] Backing services como recursos anexáveis (regra **043**)
- [ ] Configurações via environment (regra **042**)

### 6. Implementar Controllers/APIs
- [ ] Port Binding (regra **046**)
- [ ] Stateless processes (regra **045**)
- [ ] Tratamento de exceções assíncronas (regra **028**)
- [ ] Retornar exceções de domínio, não null (regra **027**)

### 7. Validações de Código

#### Object Calisthenics (001-009)
- [ ] Nível único de indentação (001)
- [ ] Proibição de ELSE (002)
- [ ] Encapsulamento de primitivos (003)
- [ ] Coleções primeira classe (004)
- [ ] Máximo uma chamada por linha (005)
- [ ] Nomes completos, sem abreviações (006)
- [ ] Máximo 50 linhas por classe (007)
- [ ] Proibição de getters/setters (008)
- [ ] Tell, Don't Ask (009)

#### SOLID + Package (010-020)
- [ ] SRP, OCP, LSP, ISP, DIP validados

#### Clean Code (021-029)
- [ ] DRY, KISS, YAGNI aplicados
- [ ] Sem magic numbers/strings (024)
- [ ] Sem God Objects (025)

#### Security + CQS (030-039)
- [ ] Sem eval/secrets hardcoded (030)
- [ ] Path aliases only (031)
- [ ] CQS aplicado (038)

#### 12-Factor App (040-051)
- [ ] Codebase única (040)
- [ ] Dependências explícitas (041)
- [ ] Config via env (042)
- [ ] Serviços como recursos (043)

### 8. Testes Unitários
- [ ] Cobertura ≥ 85% (regra **032**)
- [ ] Padrão AAA (Arrange-Act-Assert)
- [ ] Máximo 2 assertivas por teste
- [ ] Sem lógica de controle em testes

### 9. Validação com Reviewer
- [ ] Executar `/reviewer` antes do commit
- [ ] Validar ICP (Intrinsic Complexity Points)
  - Método: ≤ 15 ICPs
  - Classe: ≤ 50 ICPs
- [ ] Validar skills (18 convenções)
- [ ] Validar regras (51 arquiteturais)
- [ ] Veredito: ✅ APROVADO (0 violações críticas)

### 10. Auto-formatação
- [ ] Hook PostToolUse executa lint.sh automaticamente
- [ ] `bunx biome check --write` em *.ts, *.tsx, *.js, *.jsx, *.json

---

## Validações Críticas
- [ ] CC ≤ 5 em TODOS os métodos (skill **complexity**)
- [ ] Imports via path aliases, sem `../` (regra **031**)
- [ ] Cobertura de testes ≥ 85% (regra **032**)
- [ ] Zero violações críticas no `/reviewer`

---

## Entregáveis
- Código implementado em `src/{context}/{container}/{component}/`
- Testes unitários com cobertura ≥ 85%
- Validação aprovada pelo `/reviewer`
- Código formatado pelo hook lint.sh

---

## Próximos Passos
Após implementar e validar, execute `/clear` e prossiga para a etapa **04. docs** para atualização de documentação.
