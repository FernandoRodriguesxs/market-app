import { describe, it, expect, mock } from 'bun:test'
import bcrypt from 'bcryptjs'
import { AuthenticateUserUseCase } from './authenticate-user'
import type { IUserRepository } from './user-repository'
import type { ISessionService } from '@/lib/auth'
import { InvalidCredentialsError } from '@/lib/auth/errors'
import { InvalidEmailError } from '@/lib/auth/email'
import { InvalidPasswordError } from '@/lib/auth/password'

function makeRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return { findByEmail: mock(async () => null), ...overrides }
}

function makeSessionService(overrides: Partial<ISessionService> = {}): ISessionService {
  return {
    create: mock(async () => 'mock-jwt-token'),
    verify: mock(async () => ({ userId: 'x', email: 'a@b.com' })),
    ...overrides,
  }
}

describe('AuthenticateUserUseCase', () => {
  it('TC-001: retorna userId, email e sessionToken para credenciais válidas', async () => {
    const hash = await bcrypt.hash('senha123', 10)
    const repository = makeRepository({
      findByEmail: mock(async () => ({ id: 'user-1', email: 'user@example.com', passwordHash: hash })),
    })

    const useCase = new AuthenticateUserUseCase(repository, makeSessionService())
    const result = await useCase.execute({ email: 'user@example.com', password: 'senha123' })

    expect(result.userId).toBe('user-1')
    expect(result.email).toBe('user@example.com')
    expect(typeof result.sessionToken).toBe('string')
  })

  it('TC-002: lança InvalidCredentialsError quando email não existe no repositório', async () => {
    const useCase = new AuthenticateUserUseCase(makeRepository(), makeSessionService())
    await expect(useCase.execute({ email: 'ghost@example.com', password: 'senha123' }))
      .rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('TC-003: lança InvalidCredentialsError quando senha não coincide com hash', async () => {
    const hash = await bcrypt.hash('outrasenha', 10)
    const repository = makeRepository({
      findByEmail: mock(async () => ({ id: 'user-1', email: 'user@example.com', passwordHash: hash })),
    })

    const useCase = new AuthenticateUserUseCase(repository, makeSessionService())
    await expect(useCase.execute({ email: 'user@example.com', password: 'senha123' }))
      .rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('TC-004: lança InvalidEmailError antes de consultar o repositório para email inválido', async () => {
    const repository = makeRepository()
    const useCase = new AuthenticateUserUseCase(repository, makeSessionService())

    await expect(useCase.execute({ email: 'invalido', password: 'senha123' }))
      .rejects.toBeInstanceOf(InvalidEmailError)

    expect(repository.findByEmail).not.toHaveBeenCalled()
  })

  it('TC-005: lança InvalidPasswordError antes de consultar o repositório para senha curta', async () => {
    const repository = makeRepository()
    const useCase = new AuthenticateUserUseCase(repository, makeSessionService())

    await expect(useCase.execute({ email: 'user@example.com', password: 'curta' }))
      .rejects.toBeInstanceOf(InvalidPasswordError)

    expect(repository.findByEmail).not.toHaveBeenCalled()
  })
})
