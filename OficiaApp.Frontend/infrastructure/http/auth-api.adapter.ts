import type { AuthApiPort } from '@/application/ports/out/auth-api.port'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/domain/auth/types'
import { apiFetch } from './api-client'
import { ApiError } from './api-error'

export const authApi: AuthApiPort = {
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
   * Session bootstrap: JWT is httpOnly so JS cannot read it — ask the Api.
   * 401 is expected when logged out; return null instead of throwing.
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
