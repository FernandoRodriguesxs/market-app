'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Email } from '@/lib/auth/email'
import { Password, InvalidPasswordError } from '@/lib/auth/password'
import { LOGIN_API_PATH } from '@/lib/auth/constants'

interface FormErrors { email?: string; password?: string; general?: string }
interface FormState { email: string; password: string; errors: FormErrors; isLoading: boolean }

const INITIAL_STATE: FormState = { email: '', password: '', errors: {}, isLoading: false }

function validateEmailField(value: string): string | undefined {
  if (!value) return 'Email é obrigatório'
  try { Email.create(value); return undefined } catch { return 'Email inválido' }
}

function validatePasswordField(value: string): string | undefined {
  if (!value) return 'Senha é obrigatória'
  try { Password.create(value); return undefined }
  catch (error) {
    if (error instanceof InvalidPasswordError) return error.message
    return 'Senha inválida'
  }
}

async function postLogin(email: string, password: string): Promise<string | undefined> {
  const response = await fetch(LOGIN_API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (response.ok) return undefined
  const data = await response.json()
  return data?.error?.message ?? 'Erro ao fazer login. Tente novamente.'
}

export function useLoginForm(redirectTo: string) {
  const router = useRouter()
  const [state, setState] = useState<FormState>(INITIAL_STATE)

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const emailError = validateEmailField(event.target.value)
    setState(prev => ({ ...prev, email: event.target.value, errors: { ...prev.errors, email: emailError, general: undefined } }))
  }

  function handlePasswordBlur(event: React.FocusEvent<HTMLInputElement>) {
    setState(prev => ({ ...prev, errors: { ...prev.errors, password: validatePasswordField(event.target.value) } }))
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState(prev => ({ ...prev, password: event.target.value, errors: { ...prev.errors, general: undefined } }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const emailError = validateEmailField(state.email)
    const passwordError = validatePasswordField(state.password)
    if (emailError || passwordError) {
      setState(prev => ({ ...prev, errors: { email: emailError, password: passwordError } }))
      return
    }
    setState(prev => ({ ...prev, isLoading: true, errors: {} }))
    try {
      const generalError = await postLogin(state.email, state.password)
      if (!generalError) { router.push(redirectTo); return }
      setState(prev => ({ ...prev, isLoading: false, errors: { general: generalError } }))
    } catch {
      setState(prev => ({ ...prev, isLoading: false, errors: { general: 'Erro de conexão. Tente novamente.' } }))
    }
  }

  return { state, handleEmailChange, handlePasswordChange, handlePasswordBlur, handleSubmit }
}
