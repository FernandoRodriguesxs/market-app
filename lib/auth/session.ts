import { SignJWT, jwtVerify } from 'jose'
import type { SessionPayload } from '@/types'
import { JWT_SIGNING_ALGORITHM, SESSION_EXPIRATION } from './constants'

export interface ISessionService {
  create(payload: SessionPayload): Promise<string>
  verify(token: string): Promise<SessionPayload>
}

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required')
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export class SessionService implements ISessionService {
  async create(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: JWT_SIGNING_ALGORITHM })
      .setExpirationTime(SESSION_EXPIRATION)
      .setIssuedAt()
      .sign(JWT_SECRET)
  }

  async verify(token: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  }
}
