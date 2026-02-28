# arc42 — Autenticação por Login (001-login)

**Versão**: 1.0
**Data**: 2026-02-28
**Status**: Implementado

---

## 1. Introdução e Objetivos

### 1.1 Requisitos Essenciais

A feature de login permite que usuários cadastrados acessem o sistema autenticando-se com email e senha. Após autenticação bem-sucedida, uma sessão JWT é emitida e armazenada em cookie HttpOnly.

**Objetivos funcionais:**
- UC-001: Autenticar usuário com email e senha válidos
- UC-002: Redirecionar usuário já autenticado que tenta acessar `/login`
- UC-003: Proteger rotas privadas exigindo sessão válida

**Objetivos de qualidade:**
| Atributo        | Meta                                               |
|-----------------|----------------------------------------------------|
| Segurança       | Nenhum segredo em código; cookie HttpOnly + Secure |
| Manutenibilidade| CC ≤ 5 por função; ≤ 50 linhas por arquivo        |
| Testabilidade   | Use Case e VOs 100% testáveis via injeção          |
| Portabilidade   | Compatível com Edge Runtime (jose, bcryptjs)       |

### 1.2 Stakeholders

| Papel           | Interesse                                              |
|-----------------|--------------------------------------------------------|
| Usuário final   | Acesso seguro ao sistema via email/senha               |
| Desenvolvedor   | Código limpo, testável, fácil de estender              |
| Operações       | Deploy sem segredos no código; processo stateless      |

---

## 2. Restrições

### 2.1 Técnicas
- **Runtime**: Next.js 16 Edge Runtime — sem APIs Node.js nativas em middleware/route handlers
- **Criptografia JWT**: Apenas `jose` (Web Crypto API); `jsonwebtoken` incompatível com Edge
- **Hash de senha**: `bcryptjs` (pure JS); `bcrypt` nativo incompatível com Edge/browser
- **TypeScript strict**: `noImplicitAny`, `strictNullChecks` obrigatórios
- **Path aliases**: `@/*` → `./`; imports `../` proibidos (regra 031)

### 2.2 Organizacionais
- Regras CDD (001–051): CC máximo 5, sem `else`, VOs para primitivos de domínio
- DIP obrigatório: Use Cases dependem de interfaces, nunca de implementações concretas
- Root Composer único: instanciação de dependências concretas apenas em `factory.ts`
- YAGNI: sem código especulativo; `PrismaUserRepository` stub removido

### 2.3 Convenções
- Idioma do domínio: português (mensagens de erro, labels da UI)
- Idioma do código: inglês (nomes de classes, métodos, variáveis)
- Testes: bun:test, padrão AAA, sem lógica de controle dentro de `it()`

---

## 3. Contexto do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        Navegador                            │
│  ┌──────────────┐   POST /api/auth/login                    │
│  │  LoginForm   │ ─────────────────────────────────────────►│
│  │  (React)     │ ◄─────────────────────────────────────────│
│  └──────────────┘   Set-Cookie: session=<JWT>               │
│                                                             │
│  GET /dashboard ──► Middleware ──► verifica JWT no cookie   │
└─────────────────────────────────────────────────────────────┘
         │
         │ Next.js App Router (SSR + Edge Middleware)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Market App (Next.js 16)                 │
│                                                             │
│  app/(auth)/login      →  Página de login                   │
│  app/api/auth/login    →  Route Handler (POST)              │
│  middleware.ts         →  Proteção de rotas                 │
│  lib/auth/             →  Domínio de autenticação           │
│  services/user/        →  Use Cases e repositórios          │
└─────────────────────────────────────────────────────────────┘
         │
         │ SQL (via ORM — pendente: PrismaUserRepository)
         ▼
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL                              │
│  tabela: users (id, email, password_hash, timestamps)       │
└─────────────────────────────────────────────────────────────┘
```

**Sistemas externos:**
- **Navegador**: Armazena o cookie de sessão; executa o formulário React
- **PostgreSQL**: Persistência dos usuários (migrations/001_create_users.sql)

---

## 4. Visão de Solução

A arquitetura segue **DDD em camadas** dentro de um monolito Next.js:

| Camada          | Responsabilidade                              | Localização                              |
|-----------------|-----------------------------------------------|------------------------------------------|
| Domínio         | Regras de negócio puras, VOs, erros           | `lib/auth/`                              |
| Aplicação       | Orquestração de casos de uso                  | `services/user/`                         |
| Infraestrutura  | JWT, bcrypt, banco de dados                   | `lib/auth/session.ts`, `factory.ts`      |
| Apresentação    | UI React, hooks, páginas Next.js              | `components/ui/login-form/`, `app/`      |
| Fronteira       | Middleware Edge, Route Handler                | `middleware.ts`, `app/api/auth/login/`   |

**Princípio central**: O Use Case (`AuthenticateUserUseCase`) depende somente de abstrações (`IUserRepository`, `ISessionService`). A montagem concreta ocorre exclusivamente no Root Composer (`factory.ts`).

---

## 5. Visão de Blocos de Construção

### Nível 1 — Sistema

```
market-app
├── lib/auth/          # Domínio de autenticação
├── services/user/     # Casos de uso e contrato de repositório
├── app/(auth)/login/  # Página de login (Server Component)
├── app/api/auth/login/# API Route (POST) + Root Composer
├── components/ui/login-form/ # Formulário React
└── middleware.ts      # Proteção de rotas (Edge Runtime)
```

### Nível 2 — lib/auth (Domínio)

| Arquivo            | Papel                                                        |
|--------------------|--------------------------------------------------------------|
| `constants.ts`     | Todas as constantes nomeadas (sem magic strings/numbers)     |
| `email.ts`         | Value Object `Email` — valida formato, normaliza, imutável   |
| `password.ts`      | Value Object `Password` — valida comprimento, compara hash   |
| `errors.ts`        | `InvalidCredentialsError` — erro de domínio tipado           |
| `session.ts`       | Interface `ISessionService` + implementação `SessionService` |
| `index.ts`         | Barrel export (ordem alfabética por módulo)                  |

### Nível 2 — services/user (Aplicação + Contrato)

| Arquivo                    | Papel                                              |
|----------------------------|----------------------------------------------------|
| `user-repository.ts`       | Interface `IUserRepository` — contrato de leitura  |
| `authenticate-user.ts`     | Use Case — orquestra VO, repo, sessão              |
| `authenticate-user.test.ts`| Testes unitários com mocks injetados               |

### Nível 2 — app/api/auth/login (Fronteira + Infraestrutura)

| Arquivo      | Papel                                                             |
|--------------|-------------------------------------------------------------------|
| `factory.ts` | Root Composer — instancia `SessionService` + `userRepository`     |
| `route.ts`   | Route Handler — valida payload (Zod), chama UseCase, seta cookie  |

### Nível 2 — components/ui/login-form (Apresentação)

| Arquivo             | Papel                                                   |
|---------------------|---------------------------------------------------------|
| `use-login-form.ts` | Hook — estado, validação client-side, fetch, navegação  |
| `LoginForm.tsx`     | Componente JSX puro — layout e acessibilidade           |
| `index.ts`          | Barrel export                                           |

---

## 6. Visão de Runtime

### Cenário 1: Login bem-sucedido

```
Navegador          LoginForm        API Route         UseCase         Repository      SessionService
    │                  │                │                 │                │                │
    │ submit form       │                │                 │                │                │
    │──────────────────►│                │                 │                │                │
    │                  │ POST /api/...  │                 │                │                │
    │                  │───────────────►│                 │                │                │
    │                  │                │ execute(email,pwd)               │                │
    │                  │                │────────────────►│                │                │
    │                  │                │                 │ Email.create() │                │
    │                  │                │                 │ Password.create()               │
    │                  │                │                 │ findByEmail()  │                │
    │                  │                │                 │───────────────►│                │
    │                  │                │                 │◄───────────────│                │
    │                  │                │                 │ password.matches(hash)          │
    │                  │                │                 │ sessionService.create()         │
    │                  │                │                 │───────────────────────────────►│
    │                  │                │                 │◄───────────────────────────────│
    │                  │                │◄────────────────│                │                │
    │                  │                │ Set-Cookie: session=JWT          │                │
    │◄─────────────────────────────────│                 │                │                │
    │ router.push(redirectTo)           │                 │                │                │
```

### Cenário 2: Credenciais inválidas

```
Navegador          LoginForm        API Route         UseCase
    │                  │                │                 │
    │ submit form       │                │                 │
    │──────────────────►│                │                 │
    │                  │ POST /api/...  │                 │
    │                  │───────────────►│                 │
    │                  │                │ execute()       │
    │                  │                │────────────────►│
    │                  │                │                 │ throws InvalidCredentialsError
    │                  │                │◄────────────────│
    │                  │                │ 401 INVALID_CREDENTIALS
    │◄─────────────────────────────────│                 │
    │ state.errors.general = msg        │                 │
```

### Cenário 3: Acesso a rota protegida sem sessão

```
Navegador          Middleware (Edge)
    │                  │
    │ GET /dashboard   │
    │─────────────────►│
    │                  │ cookies.get(SESSION_COOKIE_NAME) → undefined
    │                  │ isProtected = true
    │                  │ verifyProtectedAccess() → redirect
    │◄─────────────────│
    │ 302 → /login?redirect=/dashboard
```

### Cenário 4: Usuário autenticado acessa /login

```
Navegador          Middleware (Edge)    SessionService
    │                  │                    │
    │ GET /login        │                    │
    │─────────────────►│                    │
    │                  │ pathname === LOGIN_PATH && cookie present
    │                  │ sessionService.verify(token)
    │                  │───────────────────►│
    │                  │◄───────────────────│
    │                  │ redirect to '/'   │
    │◄─────────────────│                    │
    │ 302 → /           │                    │
```

---

## 7. Visão de Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel / Node.js Host                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               Next.js 16 Application                │   │
│  │                                                     │   │
│  │  Edge Runtime:          Node.js Runtime:            │   │
│  │  ┌──────────────┐       ┌─────────────────────┐    │   │
│  │  │ middleware.ts │       │ app/api/auth/login/  │    │   │
│  │  │ (jose, puro) │       │ route.ts             │    │   │
│  │  └──────────────┘       │ factory.ts           │    │   │
│  │                         └─────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            │ DATABASE_URL (env var)         │
│                            ▼                                │
│                    ┌───────────────┐                        │
│                    │  PostgreSQL   │                        │
│                    └───────────────┘                        │
│                                                             │
│  Variáveis de ambiente obrigatórias:                        │
│    JWT_SECRET       → segredo para assinar JWTs             │
│    DATABASE_URL     → string de conexão PostgreSQL          │
└─────────────────────────────────────────────────────────────┘
```

**Stateless por design**: Sessão armazenada no JWT (cliente), não no servidor. Múltiplas instâncias podem verificar o mesmo token sem coordenação.

---

## 8. Conceitos Transversais

### 8.1 Segurança

| Vetor                  | Mitigação                                                      |
|------------------------|----------------------------------------------------------------|
| Força bruta            | Mensagem genérica `InvalidCredentialsError` (sem discriminar email vs. senha) |
| XSS / roubo de cookie  | Cookie `HttpOnly` — inacessível ao JavaScript                  |
| CSRF                   | `SameSite=Strict` no cookie                                    |
| Interceptação          | `Secure` em produção (HTTPS only)                             |
| Vazamento de segredo   | `JWT_SECRET` via `process.env`; falha imediata se ausente      |
| Injeção de email       | Normalização e validação via regex no `Email` VO               |
| Overflow de bcrypt     | `MAXIMUM_PASSWORD_LENGTH = 72` (limite nativo do bcrypt)       |

### 8.2 Validação em Camadas

```
Camada          Validação                         Onde
─────────────────────────────────────────────────────────────
Client-side     Email.create() + Password.create() use-login-form.ts
API boundary    Zod schema (LoginSchema)           route.ts
Domain          Email VO + Password VO             authenticate-user.ts
```

### 8.3 Tratamento de Erros

| Tipo de Erro             | HTTP Status | Código              | Onde lançado                  |
|--------------------------|-------------|---------------------|-------------------------------|
| Payload malformado       | 400         | `VALIDATION_ERROR`  | route.ts (Zod)                |
| Credenciais inválidas    | 401         | `INVALID_CREDENTIALS` | UseCase                    |
| Email inválido (VO)      | 400         | `VALIDATION_ERROR`  | route.ts (Zod captura antes)  |
| JWT_SECRET ausente       | 500 (startup) | —                 | session.ts (fail-fast)        |
| Erro inesperado          | 500         | `SERVER_ERROR`      | route.ts (catch genérico)     |

### 8.4 Imutabilidade dos Value Objects

Todos os VOs chamam `Object.freeze(this)` no construtor, garantindo que nenhum código externo altere o estado após a criação.

### 8.5 Inversão de Dependência

```
AuthenticateUserUseCase
    depends on → IUserRepository  (interface)
    depends on → ISessionService  (interface)

factory.ts (Root Composer):
    binds IUserRepository  → { findByEmail: ... }  (inline / futuro: PrismaUserRepository)
    binds ISessionService  → new SessionService()
```

---

## 9. Decisões de Arquitetura

### ADR-001: `jose` em vez de `jsonwebtoken`

**Contexto**: Next.js Middleware executa no Edge Runtime (sem APIs Node.js nativas).
**Decisão**: Usar `jose` (Web Crypto API-based) para compatibilidade com Edge.
**Consequência**: `jose` é verbose (builder pattern), mas totalmente compatível.

### ADR-002: `bcryptjs` em vez de `bcrypt`

**Contexto**: `bcrypt` usa bindings nativos incompatíveis com Edge/browser.
**Decisão**: `bcryptjs` (pure JS) garante compatibilidade universal.
**Consequência**: Performance ligeiramente inferior, aceitável para auth.

### ADR-003: Root Composer em `factory.ts`

**Contexto**: DIP exige que Use Cases não instanciem dependências concretas.
**Decisão**: Um único arquivo `factory.ts` por Route Handler faz a composição.
**Consequência**: Ponto único de troca de implementação (ex: PrismaUserRepository).

### ADR-004: JWT em cookie HttpOnly em vez de localStorage

**Contexto**: Tokens em `localStorage` são vulneráveis a XSS.
**Decisão**: Cookie `HttpOnly; Secure; SameSite=Strict`.
**Consequência**: Requer middleware server-side para proteção de rotas.

### ADR-005: Validação duplicada (client + server)

**Contexto**: UX requer feedback imediato; segurança exige validação server-side.
**Decisão**: Reutilizar os mesmos VOs (`Email.create()`, `Password.create()`) no hook client-side e no Use Case server-side.
**Consequência**: DRY na lógica de validação; dois níveis de proteção.

---

## 10. Qualidade e Riscos

### 10.1 Métricas de Qualidade

| Arquivo                       | Linhas | CC máx | Violações CDD |
|-------------------------------|--------|--------|---------------|
| `lib/auth/constants.ts`       | 12     | 1      | 0             |
| `lib/auth/email.ts`           | 26     | 3      | 0             |
| `lib/auth/password.ts`        | 22     | 3      | 0             |
| `lib/auth/errors.ts`          | 7      | 1      | 0             |
| `lib/auth/session.ts`         | 27     | 2      | 0             |
| `services/user/user-repository.ts` | 5 | 1      | 0             |
| `services/user/authenticate-user.ts` | 35 | 3   | 0             |
| `app/api/auth/login/factory.ts` | 15   | 1      | 0             |
| `app/api/auth/login/route.ts` | 42     | 4      | 0             |
| `middleware.ts`               | 41     | 4      | 0             |
| `components/ui/login-form/use-login-form.ts` | ~60 | 4 | 0        |
| `components/ui/login-form/LoginForm.tsx` | 58 | 2   | 0             |

### 10.2 Riscos e Mitigações

| Risco                              | Probabilidade | Impacto | Mitigação                              |
|------------------------------------|---------------|---------|----------------------------------------|
| `PrismaUserRepository` não implementado | Alta    | Alta    | `factory.ts` lança erro descritivo     |
| JWT_SECRET fraco em produção       | Média         | Alta    | Documentar em `.env.example`           |
| Expiração de sessão (24h)          | Baixa         | Média   | Constante `SESSION_EXPIRATION` alterável |
| Replay de token antes de expirar   | Baixa         | Média   | Futuro: token revocation list          |

---

## 11. Glossário

| Termo                  | Definição                                                  |
|------------------------|------------------------------------------------------------|
| Value Object (VO)      | Objeto imutável que encapsula validação de um primitivo    |
| Root Composer          | Ponto único de instanciação de dependências concretas      |
| ISessionService        | Interface para criação e verificação de tokens JWT         |
| IUserRepository        | Interface para busca de usuários no banco de dados         |
| InvalidCredentialsError| Erro de domínio genérico para credenciais inválidas        |
| SESSION_COOKIE_NAME    | Constante `'session'` — nome do cookie HttpOnly            |
| Edge Runtime           | Ambiente de execução Next.js sem APIs Node.js nativas      |
| Guard Clause           | Retorno antecipado para eliminar `else` (regra 002)        |
| CC                     | Complexidade Ciclomática — métrica de complexidade         |

---

## 12. Referências

- [PRD.md](PRD.md) — Requisitos de produto
- [specs.md](specs.md) — Especificações técnicas
- [tasks.md](tasks.md) — Tarefas de implementação
- [design.md](design.md) — Design visual
- [lib/auth/constants.ts](../../lib/auth/constants.ts) — Constantes centralizadas
- [services/user/authenticate-user.ts](../../services/user/authenticate-user.ts) — Use Case
- [app/api/auth/login/factory.ts](../../app/api/auth/login/factory.ts) — Root Composer
- [middleware.ts](../../middleware.ts) — Middleware de proteção
