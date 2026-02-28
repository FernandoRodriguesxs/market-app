import type { Metadata } from 'next'
import { LoginForm } from '@/components/ui/login-form'

export const metadata: Metadata = {
  title: 'Entrar — Market App',
  description: 'Acesse sua conta no Market App',
}

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams
  return (
    <main>
      <h1>Entrar na sua conta</h1>
      <LoginForm redirectTo={redirect ?? '/'} />
    </main>
  )
}
