# Tasks - Página de Login

**Status**: Draft
**Autor**: Fernando
**Data**: 2026-02-26
**Versão**: 1.0
**Relacionado**: `PRD.md`, `design.md`, `specs.md`

---

## ⚠️ IMPORTÂNCIA CRÍTICA DA DECOMPOSIÇÃO ATÔMICA

> **Este documento é o mais crítico do workflow SDD**
>
> Decomposição atômica reduz alucinações de IA de **60.4% para 0.9%**
>
> **Fundamentação Teórica**:
> - **Shannon (1948)**: Reduz entropia da informação através de especificação completa
> - **Vaswani et al. (2017)**: Context window limitado - cada task cabe em O(n) ao invés de O(n²)
> - **Liu et al. (2023)**: "Lost in the Middle" - evita perda de contexto em instruções longas

---

## 1. Princípios de Decomposição

### 1.1 Critérios de Atomicidade
Uma task é **atômica** quando:
- [ ] Pode ser completada em **uma única sessão** (< 2 horas)
- [ ] Tem **um único objetivo** claro e mensurável
- [ ] **Não depende** de decisões de design a serem tomadas
- [ ] Pode ser **testada** isoladamente
- [ ] Cabe em **um único contexto** de IA (< 4000 tokens)

---

## 2. Tasks Atômicas

### FASE 1: Setup

#### TASK-001: Criar estrutura de diretórios
**Objetivo**: Criar pastas e arquivos base para a feature de login
**Estimativa**: 5 min
**Dependências**: Nenhuma

**Checklist**:
- [ ] Criar `app/(auth)/login/`
- [ ] Criar `app/api/auth/login/`
- [ ] Criar `components/ui/login-form/`
- [ ] Criar `lib/auth/`
- [ ] Criar `services/user/`

**Critério de Aceitação**:
```
Estrutura de pastas criada conforme design.md seção 4.1
```

**Comandos**:
```bash
mkdir -p app/\(auth\)/login
mkdir -p app/api/auth/login
mkdir -p components/ui/login-form
mkdir -p lib/auth
mkdir -p services/user
```

---

#### TASK-002: Instalar dependências necessárias
**Objetivo**: Adicionar `jose` e `bcryptjs` ao projeto
**Estimativa**: 5 min
**Dependências**: TASK-001

**Checklist**:
- [ ] Adicionar `jose` (JWT para Edge Runtime)
- [ ] Adicionar `bcryptjs` (hash de senha, puro JS)
- [ ] Adicionar `@types/bcryptjs` (tipos TypeScript)
- [ ] Verificar `pnpm install` sem erros

**Critério de Aceitação**:
```bash
pnpm list | grep -E "jose|bcryptjs"
# Deve mostrar as duas libs instaladas
```

**Comandos**:
```bash
pnpm add jose bcryptjs
pnpm add -D @types/bcryptjs
```

---

### FASE 2: Domain Layer

#### TASK-003: Criar Value Object Email
**Objetivo**: Implementar `Email` VO com validação e normalização
**Estimativa**: 20 min
**Dependências**: TASK-001

**Especificação**:
```typescript
// Localização: lib/auth/email.ts

export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(raw: string): Email {
    const normalized = raw.toLowerCase().trim()
    if (!Email.isValid(normalized)) {
      throw new InvalidEmailError(normalized)
    }
    return new Email(normalized)
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}

export class InvalidEmailError extends Error {
  constructor(value: string) {
    super(`Email inválido: ${value}`)
    this.name = 'InvalidEmailError'
  }
}
```

**Validações Obrigatórias**:
- [ ] Email vazio → lança `InvalidEmailError`
- [ ] Email sem `@` → lança `InvalidEmailError`
- [ ] Email sem domínio após `@` → lança `InvalidEmailError`
- [ ] Email válido → normalizado para lowercase
- [ ] Objeto resultante é imutável (`Object.freeze`)

**Critério de Aceitação**:
- [ ] Arquivo criado em `lib/auth/email.ts`
- [ ] Export adicionado em `lib/auth/index.ts`
- [ ] `Email.create('USER@EXAMPLE.COM').toString()` retorna `'user@example.com'`

---

#### TASK-004: Criar Value Object Password
**Objetivo**: Implementar `Password` VO com validação e método `matches`
**Estimativa**: 20 min
**Dependências**: TASK-001, TASK-002

**Especificação**:
```typescript
// Localização: lib/auth/password.ts

import bcrypt from 'bcryptjs'

export class Password {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(raw: string): Password {
    if (raw.length < 8) {
      throw new InvalidPasswordError('Senha deve ter no mínimo 8 caracteres')
    }
    if (raw.length > 72) {
      throw new InvalidPasswordError('Senha deve ter no máximo 72 caracteres')
    }
    return new Password(raw)
  }

  async matches(hash: string): Promise<boolean> {
    return bcrypt.compare(this.value, hash)
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPasswordError'
  }
}
```

**Validações Obrigatórias**:
- [ ] Senha vazia → lança `InvalidPasswordError`
- [ ] Senha < 8 chars → lança `InvalidPasswordError`
- [ ] Senha > 72 chars → lança `InvalidPasswordError` (limite do bcrypt)
- [ ] Senha válida (8-72 chars) → cria objeto imutável

**Critério de Aceitação**:
- [ ] Arquivo criado em `lib/auth/password.ts`
- [ ] Export adicionado em `lib/auth/index.ts`
- [ ] `Password.create('abc1234')` lança `InvalidPasswordError`

---

#### TASK-005: Criar erro de domínio InvalidCredentialsError
**Objetivo**: Criar erro centralizado para falha de autenticação
**Estimativa**: 5 min
**Dependências**: TASK-001

**Especificação**:
```typescript
// Localização: lib/auth/errors.ts

export class InvalidCredentialsError extends Error {
  readonly code = 'INVALID_CREDENTIALS'

  constructor() {
    super('Email ou senha inválidos')
    this.name = 'InvalidCredentialsError'
  }
}
```

**Critério de Aceitação**:
- [ ] Arquivo criado em `lib/auth/errors.ts`
- [ ] `error.code === 'INVALID_CREDENTIALS'`
- [ ] `error.message === 'Email ou senha inválidos'`

---

### FASE 3: Application Layer

#### TASK-006: Criar SessionService
**Objetivo**: Implementar `SessionService` para criar e verificar JWTs
**Estimativa**: 25 min
**Dependências**: TASK-001, TASK-002, TASK-005

**Especificação**:
```typescript
// Localização: lib/auth/session.ts

import { SignJWT, jwtVerify } from 'jose'

interface SessionPayload {
  userId: string
  email: string
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const EXPIRATION = '24h'

export class SessionService {
  static async create(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(EXPIRATION)
      .setIssuedAt()
      .sign(JWT_SECRET)
  }

  static async verify(token: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionPayload
  }
}
```

**Validações Obrigatórias**:
- [ ] `JWT_SECRET` acessado via `process.env` (nunca hardcoded)
- [ ] Token criado com expiração de 24h
- [ ] Token inválido em `verify` lança exceção (do `jose`)

**Critério de Aceitação**:
- [ ] Arquivo criado em `lib/auth/session.ts`
- [ ] `SessionService.create({ userId: 'x', email: 'a@b.com' })` retorna string JWT
- [ ] Export adicionado em `lib/auth/index.ts`

---

#### TASK-007: Criar AuthenticateUserUseCase
**Objetivo**: Implementar caso de uso de autenticação orquestrando VOs e repositório
**Estimativa**: 30 min
**Dependências**: TASK-003, TASK-004, TASK-005, TASK-006

**Especificação**:
```typescript
// Localização: services/user/authenticate-user.ts

import { Email, Password, InvalidCredentialsError, SessionService } from '@/lib/auth'

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  userId: string
  email: string
  sessionToken: string
}

interface IUserRepository {
  findByEmail(email: string): Promise<{ id: string; email: string; passwordHash: string } | null>
}

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const email = Email.create(request.email)
    const password = Password.create(request.password)

    const user = await this.userRepository.findByEmail(email.toString())
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatches = await password.matches(user.passwordHash)
    if (!passwordMatches) {
      throw new InvalidCredentialsError()
    }

    const sessionToken = await SessionService.create({ userId: user.id, email: email.toString() })

    return { userId: user.id, email: email.toString(), sessionToken }
  }
}
```

**Fluxo Exato**:
1. [ ] Criar `Email` VO a partir de `request.email` (valida e normaliza)
2. [ ] Criar `Password` VO a partir de `request.password` (valida comprimento)
3. [ ] Buscar usuário via `userRepository.findByEmail(email.toString())`
4. [ ] Se não encontrado → lançar `InvalidCredentialsError`
5. [ ] Comparar senha com hash via `password.matches(user.passwordHash)`
6. [ ] Se não coincide → lançar `InvalidCredentialsError`
7. [ ] Criar JWT via `SessionService.create({ userId, email })`
8. [ ] Retornar `{ userId, email, sessionToken }`

**Critério de Aceitação**:
- [ ] Arquivo criado em `services/user/authenticate-user.ts`
- [ ] Injeta `IUserRepository` pelo construtor (não instancia concretamente)
- [ ] Lança `InvalidCredentialsError` para email inexistente E senha incorreta

---

### FASE 4: Infrastructure Layer

#### TASK-008: Criar migration da tabela users
**Objetivo**: Criar schema SQL da tabela `users`
**Estimativa**: 15 min
**Dependências**: Nenhuma (pode ser paralelo)

**Especificação**:
```sql
-- Localização: migrations/001_create_users.sql

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Critério de Aceitação**:
- [ ] Arquivo criado em `migrations/001_create_users.sql`
- [ ] Índice único em `email`
- [ ] Migration executa sem erros em banco limpo

---

#### TASK-009: Criar API Route POST /api/auth/login
**Objetivo**: Expor o use case via HTTP com validação de schema e cookie
**Estimativa**: 35 min
**Dependências**: TASK-007

**Especificação**:
```typescript
// Localização: app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/services/user/authenticate-user'
import { InvalidCredentialsError } from '@/lib/auth'

const LoginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

// PrismaUserRepository injetado aqui (único ponto de instanciação concreta)
const userRepository = new PrismaUserRepository()
const authenticateUser = new AuthenticateUserUseCase(userRepository)

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json()
  const parsed = LoginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Payload inválido', details: parsed.error.issues } },
      { status: 400 }
    )
  }

  try {
    const result = await authenticateUser.execute(parsed.data)

    const response = NextResponse.json({ user: { id: result.userId, email: result.email } })
    response.cookies.set('session', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return response
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: error.message } },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Erro interno' } },
      { status: 500 }
    )
  }
}
```

**Critério de Aceitação**:
- [ ] Route criada em `app/api/auth/login/route.ts`
- [ ] Validação com Zod antes de qualquer lógica
- [ ] Cookie setado com flags `httpOnly`, `secure`, `sameSite: 'strict'`
- [ ] Respostas 400, 401 e 500 com código e mensagem corretos

---

### FASE 5: Presentation Layer

#### TASK-010: Criar LoginForm component
**Objetivo**: Implementar formulário Client Component com estado, validação e submissão
**Estimativa**: 45 min
**Dependências**: TASK-009

**Especificação**:
```typescript
// Localização: components/ui/login-form/LoginForm.tsx
'use client'

interface LoginFormProps {
  redirectTo?: string
}

// Estado: { email, password, errors: { email?, password?, general? }, isLoading }
// Validação: inline em onChange (email) e onBlur (password)
// Submit: POST /api/auth/login → redirect ou erro geral
// Acessibilidade: label htmlFor, aria-describedby em erros, aria-live em erro geral
```

**Elementos obrigatórios no JSX**:
- [ ] `<label htmlFor="email">Email</label>`
- [ ] `<input id="email" type="email" autoComplete="email" />`
- [ ] Mensagem de erro inline para email (condicionado a `errors.email`)
- [ ] `<label htmlFor="password">Senha</label>`
- [ ] `<input id="password" type="password" autoComplete="current-password" />`
- [ ] Mensagem de erro inline para senha
- [ ] `<button type="submit" disabled={isLoading}>` com texto "Entrar"
- [ ] Spinner/loading state visível durante `isLoading`
- [ ] Erro geral com `role="alert"` quando `errors.general` existe

**Critério de Aceitação**:
- [ ] Arquivo criado em `components/ui/login-form/LoginForm.tsx`
- [ ] `index.ts` exporta `LoginForm`
- [ ] Componente marcado com `'use client'`
- [ ] Campos de email e senha com labels semânticos
- [ ] Submit desabilitado durante loading

---

#### TASK-011: Criar LoginPage
**Objetivo**: Criar Server Component da página `/login` com metadados e layout
**Estimativa**: 15 min
**Dependências**: TASK-010

**Especificação**:
```typescript
// Localização: app/(auth)/login/page.tsx

import type { Metadata } from 'next'
import { LoginForm } from '@/components/ui/login-form'

export const metadata: Metadata = {
  title: 'Entrar — Market App',
  description: 'Acesse sua conta no Market App',
}

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams
  return (
    <main>
      <h1>Entrar na sua conta</h1>
      <LoginForm redirectTo={redirect ?? '/'} />
    </main>
  )
}
```

**Critério de Aceitação**:
- [ ] Arquivo criado em `app/(auth)/login/page.tsx`
- [ ] `Metadata` com `title` e `description` definidos
- [ ] `searchParams.redirect` passado como prop para `LoginForm`
- [ ] Server Component (sem `'use client'`)

---

#### TASK-012: Criar AuthMiddleware (proteção de rotas)
**Objetivo**: Implementar middleware Next.js que protege rotas autenticadas
**Estimativa**: 20 min
**Dependências**: TASK-006

**Especificação**:
```typescript
// Localização: middleware.ts (raiz do projeto)

import { NextRequest, NextResponse } from 'next/server'
import { SessionService } from '@/lib/auth'

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/orders']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  const sessionCookie = request.cookies.get('session')

  if (pathname === '/login' && sessionCookie) {
    const verifiedSession = await SessionService.verify(sessionCookie.value).catch(() => null)
    if (verifiedSession) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (!isProtected) {
    return NextResponse.next()
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url))
  }

  const session = await SessionService.verify(sessionCookie.value).catch(() => null)
  if (!session) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Critério de Aceitação**:
- [ ] Arquivo criado em `middleware.ts` na raiz
- [ ] Usuário sem sessão em rota protegida → redirect `/login?redirect=<rota>`
- [ ] Usuário com sessão em `/login` → redirect `/`
- [ ] Rotas de API e assets estáticos excluídos do matcher

---

### FASE 6: Testing

#### TASK-013: Unit Tests — Email VO
**Objetivo**: Cobrir todos os casos de teste do `Email` VO
**Estimativa**: 20 min
**Dependências**: TASK-003

**Localização**: `lib/auth/email.test.ts`

**Casos obrigatórios**:
| ID | Cenário | Input | Output |
|----|---------|-------|--------|
| TC-001 | Email válido | `'user@example.com'` | Não lança, retorna VO |
| TC-002 | Normaliza para lowercase | `'USER@EXAMPLE.COM'` | `.toString() === 'user@example.com'` |
| TC-003 | Remove espaços | `'  user@example.com  '` | `.toString() === 'user@example.com'` |
| TC-004 | Sem arroba | `'invalidemail'` | Lança `InvalidEmailError` |
| TC-005 | String vazia | `''` | Lança `InvalidEmailError` |
| TC-006 | Sem domínio | `'user@'` | Lança `InvalidEmailError` |
| TC-007 | Dois emails iguais | mesmos valores | `.equals()` retorna `true` |

**Critério de Aceitação**:
- [ ] 7 casos implementados
- [ ] `bun test lib/auth/email.test.ts` passa sem erros
- [ ] Coverage ≥ 85% do arquivo

---

#### TASK-014: Unit Tests — Password VO
**Objetivo**: Cobrir todos os casos de teste do `Password` VO
**Estimativa**: 20 min
**Dependências**: TASK-004

**Localização**: `lib/auth/password.test.ts`

**Casos obrigatórios**:
| ID | Cenário | Input | Output |
|----|---------|-------|--------|
| TC-001 | Senha válida (8 chars) | `'senha123'` | Não lança |
| TC-002 | Senha válida (72 chars) | `'a'.repeat(72)` | Não lança |
| TC-003 | Senha muito curta (7 chars) | `'abc1234'` | Lança `InvalidPasswordError` |
| TC-004 | Senha vazia | `''` | Lança `InvalidPasswordError` |
| TC-005 | Senha > 72 chars | `'a'.repeat(73)` | Lança `InvalidPasswordError` |
| TC-006 | `matches` com hash correto | senha + `bcrypt.hash(senha)` | `true` |
| TC-007 | `matches` com hash errado | senha + `bcrypt.hash(outra)` | `false` |

**Critério de Aceitação**:
- [ ] 7 casos implementados
- [ ] `bun test lib/auth/password.test.ts` passa sem erros

---

#### TASK-015: Unit Tests — AuthenticateUserUseCase
**Objetivo**: Cobrir fluxo do use case com repositório mockado
**Estimativa**: 30 min
**Dependências**: TASK-007

**Localização**: `services/user/authenticate-user.test.ts`

**Casos obrigatórios**:
| ID | Cenário | Setup | Output |
|----|---------|-------|--------|
| TC-001 | Credenciais válidas | repo retorna user com hash correto | retorna `{ userId, email, sessionToken }` |
| TC-002 | Email não existe | repo retorna `null` | lança `InvalidCredentialsError` |
| TC-003 | Senha incorreta | repo retorna user, hash não bate | lança `InvalidCredentialsError` |
| TC-004 | Email inválido | input sem `@` | lança `InvalidEmailError` (antes de I/O) |
| TC-005 | Senha curta | input < 8 chars | lança `InvalidPasswordError` (antes de I/O) |

**Critério de Aceitação**:
- [ ] 5 casos implementados com mock do `IUserRepository`
- [ ] Nos casos TC-002 e TC-003 a mensagem de erro é **idêntica** (RN-001)
- [ ] Nos casos TC-004 e TC-005 o repositório **não é chamado** (verificar com `expect(mockRepo.findByEmail).not.toHaveBeenCalled()`)

---

### FASE 7: Documentation

#### TASK-016: Adicionar types de autenticação em types/index.ts
**Objetivo**: Exportar tipos públicos da feature de login
**Estimativa**: 10 min
**Dependências**: TASK-007, TASK-009

**Localização**: `types/index.ts`

**Adicionar**:
```typescript
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
  }
}

export interface SessionPayload {
  userId: string
  email: string
}
```

**Critério de Aceitação**:
- [ ] Tipos adicionados sem duplicar exports existentes
- [ ] Importações do projeto que precisam desses tipos usam `@/types`

---

#### TASK-017: Criar variáveis de ambiente de exemplo
**Objetivo**: Documentar variáveis necessárias em `.env.example`
**Estimativa**: 5 min
**Dependências**: Nenhuma

**Localização**: `.env.example` (raiz)

**Conteúdo a adicionar**:
```bash
# Autenticação
JWT_SECRET=your-super-secret-key-min-32-chars

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/market_app
```

**Critério de Aceitação**:
- [ ] `.env.example` criado/atualizado
- [ ] `.env.local` **não** versionado (verificar `.gitignore`)
- [ ] Comentários explicativos para cada variável

---

## 3. Resumo de Estimativas

| Fase | Tasks | Tempo Total |
|------|-------|-------------|
| Setup | 2 | 10 min |
| Domain | 3 | 45 min |
| Application | 2 | 55 min |
| Infrastructure | 2 | 50 min |
| Presentation | 3 | 80 min |
| Testing | 3 | 70 min |
| Documentation | 2 | 15 min |
| **TOTAL** | **17** | **~5.5 horas** |

---

## 4. Ordem de Execução

### Sequencial Obrigatório
```
TASK-001 → TASK-002
TASK-001 → TASK-003 → TASK-007
TASK-001 → TASK-004 → TASK-007
TASK-001 → TASK-005 → TASK-007
TASK-001, TASK-002 → TASK-006 → TASK-007
TASK-007 → TASK-009 → TASK-010 → TASK-011
TASK-006 → TASK-012
```

### Pode Ser Paralelo
- TASK-008 (migration) — independente, pode rodar a qualquer momento
- TASK-013 após TASK-003
- TASK-014 após TASK-004
- TASK-015 após TASK-007
- TASK-016, TASK-017 — qualquer momento

---

## 5. Critérios de "Done"

Uma task só está **completa** quando:
- [ ] Código implementado conforme especificação EXATA do specs.md
- [ ] Testes passando: `bun test` sem erros
- [ ] Sem violações críticas das 51 regras arquiteturais
- [ ] Biome check passando: `bunx biome check --write`
- [ ] Sem `../` em imports (usar `@/` aliases)

---

## 6. Templates de Commit

```bash
# Task de implementação de VO ou serviço
git commit -m "feat(auth): add Email value object with RFC 5322 validation

TASK-003: Criar Value Object Email

- Validates email format with regex
- Normalizes to lowercase on creation
- Immutable via Object.freeze

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# Task de API route
git commit -m "feat(api): add POST /api/auth/login endpoint

TASK-009: Criar API Route POST /api/auth/login

- Validates payload with Zod schema
- Sets HttpOnly session cookie on success
- Returns 401 for invalid credentials

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# Task de testes
git commit -m "test(auth): add unit tests for Email value object

TASK-013: Unit Tests — Email VO

Coverage: 92%

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Changelog

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-02-26 | Fernando | Decomposição inicial |
