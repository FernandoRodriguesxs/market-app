import { describe, it, expect } from 'bun:test'
import bcrypt from 'bcryptjs'
import { Password, InvalidPasswordError } from './password'

describe('Password', () => {
  it('TC-001: cria VO para senha com 8 caracteres', () => {
    expect(() => Password.create('senha123')).not.toThrow()
  })

  it('TC-002: cria VO para senha com 72 caracteres', () => {
    expect(() => Password.create('a'.repeat(72))).not.toThrow()
  })

  it('TC-003: lança InvalidPasswordError para senha com 7 caracteres', () => {
    expect(() => Password.create('abc1234')).toThrow(InvalidPasswordError)
  })

  it('TC-004: lança InvalidPasswordError para senha vazia', () => {
    expect(() => Password.create('')).toThrow(InvalidPasswordError)
  })

  it('TC-005: lança InvalidPasswordError para senha com mais de 72 caracteres', () => {
    expect(() => Password.create('a'.repeat(73))).toThrow(InvalidPasswordError)
  })

  it('TC-006: matches retorna true para hash correto', async () => {
    const raw = 'senha123'
    const hash = await bcrypt.hash(raw, 10)
    const password = Password.create(raw)
    expect(await password.matches(hash)).toBe(true)
  })

  it('TC-007: matches retorna false para hash errado', async () => {
    const hash = await bcrypt.hash('outrasenha', 10)
    const password = Password.create('senha123')
    expect(await password.matches(hash)).toBe(false)
  })
})
