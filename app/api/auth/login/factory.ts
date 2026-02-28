// Root Composer — único ponto de instanciação de dependências concretas
import { AuthenticateUserUseCase } from '@/services/user/authenticate-user'
import { SessionService } from '@/lib/auth'
import type { IUserRepository } from '@/services/user/user-repository'

// TODO: Substituir pelo PrismaUserRepository quando DATABASE_URL e o Prisma Client estiverem configurados
const userRepository: IUserRepository = {
  async findByEmail(_email: string) {
    throw new Error('Configure DATABASE_URL e implemente PrismaUserRepository')
  },
}

export const authenticateUserUseCase = new AuthenticateUserUseCase(
  userRepository,
  new SessionService(),
)
