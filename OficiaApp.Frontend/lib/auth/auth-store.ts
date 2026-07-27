import { create } from 'zustand'
import type { AuthUser } from './types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

type AuthState = {
  user: AuthUser | null
  status: AuthStatus
  setUser: (user: AuthUser | null) => void
  setStatus: (status: AuthStatus) => void
}

/**
 * Este store NUNCA guarda el JWT: solo datos de perfil para pintar la UI
 * (nombre, email). La autorización real la sigue validando el backend en cada
 * request via la cookie httpOnly. Si alguien manipula este estado desde la
 * consola del navegador, no gana ningún permiso extra: es pura conveniencia
 * de UI, no un límite de seguridad.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  setStatus: (status) => set({ status }),
}))
