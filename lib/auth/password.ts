import bcrypt from 'bcryptjs'
import { MINIMUM_PASSWORD_LENGTH, MAXIMUM_PASSWORD_LENGTH } from './constants'

export class Password {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(raw: string): Password {
    if (raw.length < MINIMUM_PASSWORD_LENGTH) {
      throw new InvalidPasswordError(`Senha deve ter no mínimo ${MINIMUM_PASSWORD_LENGTH} caracteres`)
    }
    if (raw.length > MAXIMUM_PASSWORD_LENGTH) {
      throw new InvalidPasswordError(`Senha deve ter no máximo ${MAXIMUM_PASSWORD_LENGTH} caracteres`)
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
