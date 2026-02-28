import { describe, it, expect } from 'bun:test'
import { Email, InvalidEmailError } from './email'

describe('Email', () => {
  it('TC-001: cria VO para email válido', () => {
    const email = Email.create('user@example.com')
    expect(email.toString()).toBe('user@example.com')
  })

  it('TC-002: normaliza para lowercase', () => {
    const email = Email.create('USER@EXAMPLE.COM')
    expect(email.toString()).toBe('user@example.com')
  })

  it('TC-003: remove espaços nas bordas', () => {
    const email = Email.create('  user@example.com  ')
    expect(email.toString()).toBe('user@example.com')
  })

  it('TC-004: lança InvalidEmailError para email sem arroba', () => {
    expect(() => Email.create('invalidemail')).toThrow(InvalidEmailError)
  })

  it('TC-005: lança InvalidEmailError para string vazia', () => {
    expect(() => Email.create('')).toThrow(InvalidEmailError)
  })

  it('TC-006: lança InvalidEmailError para email sem domínio', () => {
    expect(() => Email.create('user@')).toThrow(InvalidEmailError)
  })

  it('TC-007: equals retorna true para dois emails iguais', () => {
    const first = Email.create('user@example.com')
    const second = Email.create('user@example.com')
    expect(first.equals(second)).toBe(true)
  })
})
