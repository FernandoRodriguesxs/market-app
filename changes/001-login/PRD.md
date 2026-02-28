# PRD - Página de Login

**Status**: Draft
**Autor**: Fernando
**Data**: 2026-02-26
**Versão**: 1.0

---

## 1. Executive Summary

O Market App necessita de uma página de autenticação para controlar o acesso às funcionalidades da plataforma. Atualmente, não existe mecanismo de login, o que impede a personalização da experiência do usuário e a proteção de dados sensíveis.

A solução consiste em uma página de login com formulário de email e senha, com validação no cliente e no servidor, tratamento de erros adequado e redirecionamento após autenticação bem-sucedida.

O valor de negócio é direto: habilitar o acesso seguro e personalizado ao Market App, possibilitando funcionalidades como histórico de compras, carrinho persistente e preferências do usuário.

---

## 2. Problema

### 2.1 Contexto
O Market App é uma aplicação de marketplace que requer identificação do usuário para acessar funcionalidades protegidas. Sem autenticação, não é possível associar pedidos, preferências ou dados financeiros ao usuário correto.

### 2.2 Impacto
- Usuários não conseguem acessar áreas protegidas da aplicação
- Impossibilidade de persistir carrinho e histórico de compras
- Ausência de controle de acesso a recursos sensíveis
- Todos os usuários são tratados como anônimos

### 2.3 Evidências
- 100% das funcionalidades de usuário logado estão bloqueadas
- Ausência de sessão impede qualquer personalização da experiência
- Risco de segurança: dados sem controle de acesso

---

## 3. Objetivos

### 3.1 Objetivos de Negócio
- [ ] Permitir que usuários cadastrados acessem a plataforma via email e senha
- [ ] Garantir que rotas protegidas sejam inacessíveis sem autenticação válida
- [ ] Fornecer feedback claro em caso de credenciais inválidas

### 3.2 Métricas de Sucesso
| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| Taxa de login bem-sucedido | 0% (inexistente) | ≥ 95% | Logs de autenticação |
| Tempo de resposta do login | N/A | < 300ms (p95) | Tracing HTTP |
| Taxa de erro de validação | N/A | < 5% por sessão | Analytics de form |
| Acessibilidade WCAG | N/A | Nível AA | Axe / Lighthouse |

---

## 4. Proposta de Solução

### 4.1 Visão Geral
Criar uma página `/login` no Next.js App Router com um formulário client-side que submete credenciais para uma API Route (`POST /api/auth/login`). O servidor valida as credenciais, cria uma sessão via JWT armazenado em cookie HttpOnly e redireciona o usuário para a página solicitada originalmente.

### 4.2 User Stories
```gherkin
Como usuário cadastrado
Quero informar meu email e senha em um formulário
Para que eu possa acessar minha conta no Market App

Como usuário com credenciais inválidas
Quero receber uma mensagem de erro clara
Para que eu saiba que meus dados estão incorretos e possa corrigí-los

Como usuário autenticado
Quero ser redirecionado automaticamente
Para que eu não precise navegar manualmente após o login
```

### 4.3 Escopo
**In Scope**:
- [ ] Formulário de login com campos email e senha
- [ ] Validação client-side em tempo real
- [ ] Submissão e validação server-side
- [ ] Sessão via JWT em cookie HttpOnly
- [ ] Redirecionamento após login bem-sucedido
- [ ] Mensagens de erro amigáveis
- [ ] Estado de loading durante a requisição

**Out of Scope**:
- [ ] Login social (Google, GitHub) — próxima iteração
- [ ] "Esqueci minha senha" — próxima iteração
- [ ] Autenticação de dois fatores — próxima iteração
- [ ] Registro de novo usuário — feature separada

---

## 5. Requisitos Funcionais

### RF-001: Formulário de Login
**Prioridade**: Must have
**Descrição**: O formulário deve conter campos de email e senha com labels acessíveis, botão de submit e link para recuperação de senha.
**Critérios de Aceitação**:
- [ ] Campo email com type="email" e autocomplete="email"
- [ ] Campo senha com type="password" e autocomplete="current-password"
- [ ] Botão de submit com texto "Entrar"
- [ ] Label acessível associado a cada campo via `htmlFor`

### RF-002: Validação Client-Side
**Prioridade**: Must have
**Descrição**: Validação dos campos antes da submissão, com mensagens de erro inline.
**Critérios de Aceitação**:
- [ ] Email: formato válido (RFC 5322 básico)
- [ ] Senha: mínimo 8 caracteres
- [ ] Mensagem de erro exibida abaixo do campo inválido
- [ ] Botão desabilitado enquanto o formulário é inválido

### RF-003: Submissão e Autenticação
**Prioridade**: Must have
**Descrição**: Submissão do formulário para a API com tratamento completo de resposta.
**Critérios de Aceitação**:
- [ ] Requisição POST para `/api/auth/login`
- [ ] Estado de loading visível durante a requisição
- [ ] Redirecionamento para `/` ou rota de origem em caso de sucesso
- [ ] Exibição de mensagem de erro em caso de falha (credenciais inválidas, servidor indisponível)

### RF-004: Segurança de Sessão
**Prioridade**: Must have
**Descrição**: Sessão armazenada de forma segura via cookie HttpOnly.
**Critérios de Aceitação**:
- [ ] JWT armazenado em cookie `HttpOnly; Secure; SameSite=Strict`
- [ ] Token com expiração de 24 horas
- [ ] Cookie não acessível via JavaScript client-side

### RF-005: Proteção de Rotas
**Prioridade**: Must have
**Descrição**: Middleware que redireciona usuários não autenticados para `/login`.
**Critérios de Aceitação**:
- [ ] Middleware aplicado nas rotas protegidas
- [ ] Parâmetro `redirect` preservado na URL de login
- [ ] Usuário autenticado tentando acessar `/login` é redirecionado para `/`

---

## 6. Requisitos Não-Funcionais

### RNF-001: Performance
- Tempo de resposta da API de login < 300ms (p95)
- Tempo de carregamento da página < 1s (LCP)
- Bundle da página de login < 50KB (gzipped)

### RNF-002: Segurança
- Credenciais transmitidas apenas via HTTPS
- Senha nunca armazenada em plain text (bcrypt, cost factor 12)
- Rate limiting: máximo 5 tentativas de login por IP por minuto
- Headers de segurança: HSTS, X-Content-Type-Options, X-Frame-Options

### RNF-003: Acessibilidade
- WCAG 2.1 nível AA
- Navegação completa por teclado
- Labels semânticos para leitores de tela
- Contraste de cor ≥ 4.5:1

### RNF-004: Disponibilidade
- Dependente do SLA da API (99.9% uptime esperado)
- Página deve renderizar mesmo com JS desabilitado (form tradicional)

---

## 7. User Experience

### 7.1 Jornada do Usuário
```
[Acessa rota protegida] → [Redirecionado para /login?redirect=/rota]
         → [Preenche email e senha] → [Clica em Entrar]
         → [Loading state] → [Sucesso: redirecionado para /rota]
                          → [Erro: mensagem exibida, formulário reativado]
```

### 7.2 Wireframes / Mockups
```
┌─────────────────────────────────┐
│          Market App             │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Entrar na sua conta   │   │
│  │                         │   │
│  │  Email                  │   │
│  │  [_____________________]│   │
│  │                         │   │
│  │  Senha                  │   │
│  │  [_____________________]│   │
│  │                         │   │
│  │  [      Entrar       ]  │   │
│  │                         │   │
│  │  Esqueceu a senha?      │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### 7.3 UI/UX Guidelines
- Usar design tokens do sistema para cores, espaçamentos e tipografia
- Componentes `ui/` existentes para inputs e botões
- Feedback visual imediato em foco e validação

---

## 8. Stakeholders

| Role | Nome | Responsabilidade |
|------|------|------------------|
| Product Owner | Fernando | Aprovação final |
| Tech Lead | Fernando | Revisão técnica e implementação |

---

## 9. Dependências

### 9.1 Dependências Técnicas
- [ ] Next.js 16 App Router (já disponível)
- [ ] Biblioteca de JWT (`jose` ou `jsonwebtoken`)
- [ ] Hash de senha (`bcryptjs`)
- [ ] Banco de dados com tabela `users` (a definir/criar)

### 9.2 Dependências de Negócio
- [ ] Usuários cadastrados com email e senha hasheada no banco
- [ ] Variáveis de ambiente: `JWT_SECRET`, `DATABASE_URL`

---

## 10. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Brute force nas credenciais | Alta | Alto | Rate limiting por IP + bloqueio após 5 tentativas |
| Vazamento do JWT_SECRET | Baixa | Crítico | Variável de ambiente, rotação periódica |
| Session hijacking | Média | Alto | Cookie HttpOnly + SameSite=Strict + HTTPS |
| Banco indisponível no login | Baixa | Alto | Timeout de 5s + mensagem genérica de erro |

---

## 11. Alternatives Consideradas

### Alternativa 1: NextAuth.js / Auth.js
**Prós**:
- Biblioteca madura com suporte a múltiplos providers
- Implementação mais rápida

**Contras**:
- Overhead para feature simples de email/senha
- Menor controle sobre o fluxo de autenticação
- Adiciona dependência pesada

**Por que não foi escolhida**: O escopo inicial é apenas email/senha; implementação customizada mantém controle total e menor footprint.

### Alternativa 2: Sessões em banco (server-side sessions)
**Prós**:
- Revogação imediata de sessão
- Menor payload no cookie

**Contras**:
- Requer tabela de sessões e limpeza periódica
- Mais complexo para escalar horizontalmente

**Por que não foi escolhida**: JWT stateless é suficiente para o escopo atual; revogação pode ser adicionada depois com uma blocklist.

---

## 12. Cronograma

| Fase | Duração Estimada | Data Prevista |
|------|------------------|---------------|
| Design + Specs | 1 dia | 2026-02-26 |
| Desenvolvimento | 2 dias | 2026-02-27 |
| Testes | 1 dia | 2026-03-01 |
| Deploy | 0.5 dia | 2026-03-01 |

---

## 13. Anexos

### 13.1 Referências
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [RFC 5322 - Email Format](https://tools.ietf.org/html/rfc5322)

### 13.2 Glossário
- **JWT**: JSON Web Token — token stateless para representar claims entre partes
- **HttpOnly Cookie**: Cookie inacessível ao JavaScript do browser, reduzindo risco de XSS
- **bcrypt**: Algoritmo de hash adaptativo para senhas
- **Rate limiting**: Limite de requisições por período para prevenir brute force

---

## Changelog

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-02-26 | Fernando | Versão inicial |
