import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/lib/auth'
import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE_SECONDS, MINIMUM_PASSWORD_LENGTH } from '@/lib/auth/constants'
import { authenticateUserUseCase } from './factory'

const LoginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH, `Senha deve ter no mínimo ${MINIMUM_PASSWORD_LENGTH} caracteres`),
})

function createSessionResponse(userId: string, email: string, token: string): NextResponse {
  const response = NextResponse.json({ user: { id: userId, email } })
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  })
  return response
}

function handleAuthError(error: unknown): NextResponse {
  if (error instanceof InvalidCredentialsError) {
    return NextResponse.json(
      { error: { code: 'INVALID_CREDENTIALS', message: error.message } },
      { status: 401 }
    )
  }
  return NextResponse.json(
    { error: { code: 'SERVER_ERROR', message: 'Erro interno' } },
    { status: 500 }
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null)
  const parsed = LoginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Payload inválido', details: parsed.error.issues } },
      { status: 400 }
    )
  }

  try {
    const result = await authenticateUserUseCase.execute(parsed.data)
    return createSessionResponse(result.userId, result.email, result.sessionToken)
  } catch (error) {
    return handleAuthError(error)
  }
}
