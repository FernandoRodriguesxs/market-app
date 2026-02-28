export const MINIMUM_PASSWORD_LENGTH = 8
export const MAXIMUM_PASSWORD_LENGTH = 72

export const JWT_SIGNING_ALGORITHM = 'HS256'
export const SESSION_EXPIRATION = '24h'
export const SESSION_COOKIE_NAME = 'session'
export const SESSION_COOKIE_MAX_AGE_SECONDS = 86_400

export const LOGIN_PATH = '/login'
export const LOGIN_API_PATH = '/api/auth/login'
export const PROTECTED_ROUTES = Object.freeze(['/dashboard', '/profile', '/orders'])
