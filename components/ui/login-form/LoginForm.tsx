'use client'

import { useLoginForm } from './use-login-form'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const { state, handleEmailChange, handlePasswordChange, handlePasswordBlur, handleSubmit } = useLoginForm(redirectTo)

  return (
    <form onSubmit={handleSubmit} noValidate>
      {state.errors.general && (
        <div role="alert" aria-live="assertive">
          {state.errors.general}
        </div>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={handleEmailChange}
          aria-describedby={state.errors.email ? 'email-error' : undefined}
          aria-invalid={!!state.errors.email}
        />
        {state.errors.email && (
          <span id="email-error" role="alert">{state.errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={state.password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          aria-describedby={state.errors.password ? 'password-error' : undefined}
          aria-invalid={!!state.errors.password}
        />
        {state.errors.password && (
          <span id="password-error" role="alert">{state.errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={state.isLoading}>
        {state.isLoading ? <span aria-label="Carregando">...</span> : 'Entrar'}
      </button>
    </form>
  )
}
