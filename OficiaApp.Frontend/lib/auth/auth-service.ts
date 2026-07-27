import { apiFetch } from '@/lib/api/api-client'
import { ApiError } from '@/lib/api/api-error'
import type { AuthUser, LoginPayload, RegisterPayload } from './types'

export const authService = {
  register(payload: RegisterPayload): Promise<void> {
    return apiFetch<void>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  login(payload: LoginPayload): Promise<AuthUser> {
    return apiFetch<AuthUser>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  logout(): Promise<void> {
    return apiFetch<void>('/api/users/logout', { method: 'POST' })
  },

  /**
   * Se usa para "hidratar" la sesión al cargar la app: como el JWT vive en una
   * cookie httpOnly, el JS del cliente no puede leerlo directamente, así que le
   * preguntamos a la Api quién es el usuario actual. Un 401 es un caso
   * esperado (no hay sesión), no un error real: por eso devolvemos `null` en
   * vez de dejar que el error se propague.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await apiFetch<AuthUser>('/api/users/me')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null
      }
      throw error
    }
  },
}
