import { Email, Password, InvalidCredentialsError, type ISessionService } from '@/lib/auth'
import type { IUserRepository } from './user-repository'

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  userId: string
  email: string
  sessionToken: string
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionService: ISessionService,
  ) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const email = Email.create(request.email)
    const password = Password.create(request.password)

    const user = await this.userRepository.findByEmail(email.toString())
    if (!user) throw new InvalidCredentialsError()

    const passwordMatches = await password.matches(user.passwordHash)
    if (!passwordMatches) throw new InvalidCredentialsError()

    const sessionToken = await this.sessionService.create({ userId: user.id, email: email.toString() })

    return { userId: user.id, email: email.toString(), sessionToken }
  }
}
