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
