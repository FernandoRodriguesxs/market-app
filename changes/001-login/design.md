# Design - Página de Login

**Status**: Draft
**Autor**: Fernando
**Data**: 2026-02-26
**Versão**: 1.0
**Relacionado**: `PRD.md`

---

## 1. Visão Arquitetural

### 1.1 Contexto
A página de login é o ponto de entrada do fluxo de autenticação do Market App. Ela se posiciona na camada de Presentation, comunicando-se com uma API Route do Next.js que por sua vez acessa a camada de Infrastructure (banco de dados) para validar credenciais e emitir tokens.

### 1.2 Princípios Arquiteturais
- **Separation of Concerns**: UI separada da lógica de autenticação
- **Single Responsibility**: cada componente/módulo com uma única responsabilidade
- **Dependency Inversion**: use case depende de interface de repositório, não de implementação concreta
- **Tell, Don't Ask**: entidades encapsulam validação, não expõem estado raw

---

## 2. Arquitetura de Alto Nível

### 2.1 Diagrama de Containers
```
[Browser] → [Next.js Page /login] → [LoginForm Component]
                                          ↓
                                   [POST /api/auth/login]
                                          ↓
                               [AuthenticateUserUseCase]
                                          ↓
                               [UserRepository (interface)]
                                          ↓
                               [PrismaUserRepository (impl)]
                                          ↓
                                     [Database]
```

### 2.2 Componentes Principais
| Componente | Responsabilidade | Tecnologia |
|------------|------------------|------------|
| `LoginPage` | Página de rota, layout e metadados | Next.js App Router |
| `LoginForm` | Formulário com estado e submissão | React + TypeScript |
| `AuthenticateUserUseCase` | Orquestrar validação de credenciais | TypeScript |
| `Email` (Value Object) | Encapsular e validar formato de email | TypeScript |
| `Password` (Value Object) | Encapsular e validar força da senha | TypeScript |
| `IUserRepository` | Contrato de acesso a dados de usuário | TypeScript interface |
| `PrismaUserRepository` | Implementação do repositório com Prisma | Prisma ORM |
| `SessionService` | Criar e verificar tokens JWT | `jose` library |
| `AuthMiddleware` | Proteger rotas que exigem autenticação | Next.js Middleware |

---

## 3. Decisões Arquiteturais

### ADR-001: JWT em Cookie HttpOnly vs localStorage
**Status**: Accepted

**Contexto**:
O token de sessão precisa ser armazenado no cliente. As opções principais são localStorage e cookie HttpOnly.

**Opções Consideradas**:
1. **localStorage**
   - Prós: Fácil acesso via JavaScript, simples de implementar
   - Contras: Vulnerável a XSS — qualquer script malicioso pode ler o token

2. **Cookie HttpOnly + Secure + SameSite=Strict**
   - Prós: Inacessível ao JavaScript, enviado automaticamente pelo browser, proteção nativa contra XSS
   - Contras: Requer HTTPS em produção, configuração mais cuidadosa

**Decisão**:
Cookie HttpOnly. A segurança não é negociável para tokens de autenticação.

**Consequências**:
- Positivas: Proteção automática contra XSS
- Negativas: Requer HTTPS em produção (já é obrigatório), CSRF mitigation necessária
- Trade-offs: SameSite=Strict previne CSRF mas pode interferir com alguns fluxos de redirecionamento OAuth (irrelevante no escopo atual)

---

### ADR-002: JWT Stateless vs Session no Banco
**Status**: Accepted

**Contexto**:
Sessão de usuário pode ser implementada como JWT stateless (token contém todos os dados) ou como referência a uma sessão armazenada em banco.

**Opções Consideradas**:
1. **JWT Stateless**
   - Prós: Sem estado no servidor, escala horizontalmente, sem I/O extra por requisição
   - Contras: Revogação imediata impossível sem blocklist

2. **Session no banco**
   - Prós: Revogação imediata, mais controle
   - Contras: I/O extra em toda requisição autenticada, necessita cleanup de sessões expiradas

**Decisão**:
JWT Stateless com expiração de 24h. O escopo atual não requer revogação imediata; a expiração curta limita a janela de risco.

**Consequências**:
- Positivas: Simples, sem dependência de tabela de sessões
- Negativas: Logout não invalida o token imediatamente (expira em até 24h)
- Trade-offs: Aceitável no MVP; blocklist pode ser adicionada depois se necessário

---

### ADR-003: Implementação Customizada vs NextAuth.js
**Status**: Accepted

**Contexto**:
NextAuth.js é a biblioteca padrão do ecossistema Next.js para autenticação.

**Decisão**:
Implementação customizada. Ver `PRD.md` seção 11 para justificativa completa.

---

## 4. Estrutura de Código

### 4.1 Organização de Diretórios
```
app/
├── (auth)/
│   └── login/
│       └── page.tsx              ← LoginPage (Server Component)
├── api/
│   └── auth/
│       └── login/
│           └── route.ts          ← POST /api/auth/login

components/
└── ui/
    └── login-form/
        ├── index.ts
        ├── LoginForm.tsx         ← Formulário (Client Component)
        └── LoginForm.test.tsx

lib/
├── auth/
│   ├── index.ts
│   ├── session.ts               ← SessionService (criar/verificar JWT)
│   └── middleware.ts            ← AuthMiddleware helper

services/
└── user/
    ├── index.ts
    ├── authenticate-user.ts     ← AuthenticateUserUseCase
    └── authenticate-user.test.ts

types/
└── auth.ts                      ← LoginRequest, LoginResponse, SessionPayload

middleware.ts                    ← Next.js Middleware (proteção de rotas)
```

### 4.2 Módulos e Camadas
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  LoginPage, LoginForm, API Route    │
├─────────────────────────────────────┤
│         Application Layer           │
│       AuthenticateUserUseCase       │
├─────────────────────────────────────┤
│           Domain Layer              │
│  Email VO, Password VO, User Entity │
├─────────────────────────────────────┤
│        Infrastructure Layer         │
│  PrismaUserRepository, SessionSvc   │
└─────────────────────────────────────┘
```

---

## 5. Modelo de Dados

### 5.1 Entidades de Domínio
```typescript
interface User {
  id: UserId
  email: Email
  passwordHash: PasswordHash
  createdAt: Date
}
```

### 5.2 Value Objects
```typescript
class Email {
  private readonly value: string

  private constructor(value: string) {
    Object.freeze(this)
    this.value = value
  }

  static create(raw: string): Email {
    // Validação RFC 5322 básico: contém @ e domínio
    if (!Email.isValid(raw)) {
      throw new InvalidEmailError(raw)
    }
    return new Email(raw.toLowerCase().trim())
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
}

class Password {
  private readonly value: string

  private constructor(value: string) {
    Object.freeze(this)
    this.value = value
  }

  static create(raw: string): Password {
    if (raw.length < 8) {
      throw new InvalidPasswordError('Senha deve ter no mínimo 8 caracteres')
    }
    return new Password(raw)
  }
}
```

### 5.3 Relacionamentos
```
User 1──── 1 PasswordHash (valor imutável, hash do bcrypt)
User 1──── 1 Email (VO com formato validado)
```

---

## 6. Banco de Dados

### 6.1 Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 6.2 Migrações
| Versão | Descrição | Script |
|--------|-----------|--------|
| 001 | Criar tabela users | `migrations/001_create_users.sql` |

---

## 7. APIs e Contratos

### 7.1 REST Endpoints
```http
POST /api/auth/login
```

### 7.2 Request/Response Schema
```typescript
// Request
interface LoginRequest {
  email: string
  password: string
}

// Response — sucesso (200)
interface LoginResponse {
  user: {
    id: string
    email: string
  }
}

// Response — erro (401)
interface ErrorResponse {
  error: {
    code: 'INVALID_CREDENTIALS' | 'RATE_LIMITED' | 'SERVER_ERROR'
    message: string
  }
}
```

### 7.3 Códigos de Status
| Código | Significado | Quando Usar |
|--------|-------------|-------------|
| 200 | OK | Login bem-sucedido, cookie setado |
| 400 | Bad Request | Payload inválido (email/senha ausentes) |
| 401 | Unauthorized | Credenciais inválidas |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Error | Erro inesperado no servidor |

---

## 8. Fluxo de Dados

### 8.1 Sequência Principal
```
[User] → [LoginForm] → [POST /api/auth/login] → [AuthenticateUserUseCase]
                                                       ↓
                                              [Email.create(email)]
                                              [Password.create(password)]
                                                       ↓
                                              [UserRepository.findByEmail]
                                                       ↓
                                              [bcrypt.compare(password, hash)]
                                                       ↓
                                              [SessionService.create(userId)]
                                                       ↓
                                     [Set-Cookie: session=JWT; HttpOnly]
                                                       ↓
                              [Response 200] → [LoginForm redirect]
```

### 8.2 Eventos de Domínio
Nenhum evento de domínio para o MVP. Login é uma operação de leitura/verificação que não altera estado do domínio.

---

## 9. Segurança

### 9.1 Autenticação
- JWT com algoritmo HS256, secret via `JWT_SECRET` (env var)
- Expiração: 24 horas (`exp` claim)
- Cookie: `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`

### 9.2 Autorização
```typescript
// middleware.ts — proteção de rotas
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url))
  }
}
```

### 9.3 Validação de Input
- Schema validation com Zod no API route
- Email normalizado (lowercase, trim) antes da busca no banco
- Mensagem de erro genérica ("Credenciais inválidas") — não revelar se email existe
- Rate limiting via header de IP (5 req/min por IP)

### 9.4 Hash de Senha
- bcrypt com cost factor 12
- Nunca logar a senha, mesmo em modo debug

---

## 10. Performance

### 10.1 Otimizações
- Índice B-tree em `users.email` para lookup O(log n)
- Next.js Server Component para o shell da página (zero JS inicial)
- LoginForm como Client Component isolado (hydration mínima)

### 10.2 Limites
| Recurso | Limite | Justificativa |
|---------|--------|---------------|
| bcrypt hashing | ~100ms | Cost factor 12 é adequado e seguro |
| DB query timeout | 5s | Evitar hanging requests |
| Rate limit | 5 req/min/IP | Prevenção de brute force |

---

## 11. Resiliência

### 11.1 Error Handling
```typescript
// API Route — tratar erros sem vazar detalhes internos
try {
  await authenticateUser.execute({ email, password })
  return NextResponse.json({ user }, { status: 200 })
} catch (error) {
  if (error instanceof InvalidCredentialsError) {
    return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email ou senha inválidos' } }, { status: 401 })
  }
  logger.error('Login failed', { error })
  return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Erro interno' } }, { status: 500 })
}
```

### 11.2 Retry Strategy
- Sem retry automático no client (login é ação do usuário)
- Timeout de 10s no fetch do formulário

---

## 12. Observabilidade

### 12.1 Logging
```typescript
logger.info('Login attempt', { email: maskedEmail })
logger.info('Login success', { userId, duration })
logger.warn('Login failed - invalid credentials', { email: maskedEmail })
logger.warn('Login rate limited', { ip })
logger.error('Login error', { error: error.message })
```

### 12.2 Métricas
- [ ] `auth.login.attempt` — total de tentativas
- [ ] `auth.login.success` — logins bem-sucedidos
- [ ] `auth.login.failure` — falhas por credencial inválida
- [ ] `auth.login.duration` — latência p50/p95/p99

### 12.3 Tracing
- Span de tracing para a requisição completa de login

---

## 13. Testing Strategy

### 13.1 Pirâmide de Testes
```
      ┌─────────┐
      │   E2E   │  Fluxo completo de login (Playwright)
     ┌───────────┐
     │Integration│  API Route + DB (test database)
   ┌───────────────┐
   │     Unit      │  VOs, UseCase (mocks), LoginForm
   └───────────────┘
```

### 13.2 Cobertura Esperada
- Unit: ≥ 85% (Email VO, Password VO, AuthenticateUserUseCase)
- Integration: API Route com DB real
- E2E: Happy path + credenciais inválidas

---

## 14. Deploy Strategy

### 14.1 Estratégia
- Deploy padrão do Next.js (Vercel ou self-hosted)
- Variáveis de ambiente: `JWT_SECRET`, `DATABASE_URL`
- Migration executada como processo one-off antes do deploy

### 14.2 Rollback Plan
- Reverter deploy na Vercel (instantâneo)
- Migration de rollback disponível se schema mudou

---

## 15. Dependências Externas

### 15.1 Serviços
| Serviço | Propósito | SLA | Contingência |
|---------|-----------|-----|--------------|
| Database (PostgreSQL) | Armazenar usuários | 99.9% | Mensagem de erro genérica |

### 15.2 Bibliotecas
| Biblioteca | Versão | Justificativa |
|------------|--------|---------------|
| `jose` | ^5.x | JWT sign/verify moderno, suporte a Edge Runtime |
| `bcryptjs` | ^2.x | Hash de senha, puro JS (sem dependências nativas) |
| `zod` | ^3.x | Validação de schema (já no projeto) |

---

## 16. Anexos

### 16.1 Referências
- [PRD - Página de Login](./PRD.md)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## Changelog

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-02-26 | Fernando | Versão inicial |
