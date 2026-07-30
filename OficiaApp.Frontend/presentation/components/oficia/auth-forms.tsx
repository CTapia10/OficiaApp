'use client'

import { useState, type FormEvent } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/presentation/hooks/use-auth'
import { ApiError } from '@/infrastructure/http/api-error'
import { cn } from '@/presentation/lib/utils'

type Tab = 'login' | 'register'

function fieldError(error: unknown): string | null {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return null
}

function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch {
      // El error ya queda expuesto vía `loginError` (estado de la mutation);
      // acá solo evitamos que la excepción quede "unhandled" en consola.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="••••••••"
        />
      </div>

      {loginError && (
        <p className="text-sm text-destructive">{fieldError(loginError) ?? 'No pudimos iniciar sesión.'}</p>
      )}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="oficia-gradient mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        <LogIn className="size-4" />
        {isLoggingIn ? 'Ingresando…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const { register, isRegistering, registerError } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await register({ username, email, password })
      onRegistered()
    } catch {
      // Idem LoginForm: el error se refleja vía `registerError`.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="register-username" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Nombre de usuario
        </label>
        <input
          id="register-username"
          type="text"
          required
          minLength={3}
          maxLength={50}
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="register-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label htmlFor="register-password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      {registerError && (
        <p className="text-sm text-destructive">
          {fieldError(registerError) ?? 'No pudimos crear la cuenta.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isRegistering}
        className="oficia-gradient mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        <UserPlus className="size-4" />
        {isRegistering ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}

export function AuthGate() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card p-5">
      <h1 className="font-display text-xl font-bold text-balance">
        Iniciá sesión para continuar
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Necesitás una cuenta para ver tu perfil y usar el Radar de trabajos.
      </p>

      <div className="mt-4 flex gap-1 rounded-xl border border-border bg-background/40 p-1">
        {(['login', 'register'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
              tab === t
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t === 'login' ? 'Ingresar' : 'Registrarme'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm onRegistered={() => setTab('login')} />
        )}
      </div>
    </section>
  )
}
