export class InvalidCredentialsError extends Error {
  readonly code = 'INVALID_CREDENTIALS'

  constructor() {
    super('Email ou senha inválidos')
    this.name = 'InvalidCredentialsError'
  }
}
