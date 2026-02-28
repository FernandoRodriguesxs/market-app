export interface IUserRepository {
  findByEmail(email: string): Promise<{ id: string; email: string; passwordHash: string } | null>
}
