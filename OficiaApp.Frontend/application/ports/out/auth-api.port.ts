import type { AuthUser, LoginPayload, RegisterPayload } from '@/domain/auth/types'

export interface AuthApiPort {
  register(payload: RegisterPayload): Promise<void>
  login(payload: LoginPayload): Promise<AuthUser>
  logout(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
}
