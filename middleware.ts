import { NextRequest, NextResponse } from 'next/server'
import { SessionService } from '@/lib/auth'
import { PROTECTED_ROUTES, LOGIN_PATH, SESSION_COOKIE_NAME } from '@/lib/auth/constants'

const sessionService = new SessionService()

async function redirectIfAuthenticated(request: NextRequest, cookieValue: string): Promise<NextResponse | null> {
  const session = await sessionService.verify(cookieValue).catch(() => null)
  if (!session) return null
  return NextResponse.redirect(new URL('/', request.url))
}

async function verifyProtectedAccess(request: NextRequest, pathname: string, cookieValue: string | undefined): Promise<NextResponse> {
  if (!cookieValue) {
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?redirect=${pathname}`, request.url))
  }
  const session = await sessionService.verify(cookieValue).catch(() => null)
  if (!session) {
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?redirect=${pathname}`, request.url))
  }
  return NextResponse.next()
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

  if (pathname === LOGIN_PATH && sessionCookie) {
    const redirect = await redirectIfAuthenticated(request, sessionCookie.value)
    if (redirect) return redirect
  }

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  return verifyProtectedAccess(request, pathname, sessionCookie?.value)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
