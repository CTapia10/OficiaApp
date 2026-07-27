'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/lib/auth/auth-service'
import { useAuthStore } from '@/lib/auth/auth-store'
import type { LoginPayload, RegisterPayload } from '@/lib/auth/types'

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const

/**
 * Punto único de entrada a todo lo relacionado con sesión desde componentes.
 * Combina TanStack Query (llamadas de red + cache) con Zustand (estado global
 * legible desde cualquier componente sin prop-drilling).
 */
export function useAuth() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  // Bootstrap de sesión: se dispara una sola vez al montar el Provider (ver
  // app/providers.tsx) para saber si la cookie httpOnly todavía es válida.
  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      return currentUser
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (authUser) => {
      setUser(authUser)
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, authUser)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null)
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
      // Cualquier dato cacheado (Radar, futuras solicitudes propias, etc.) pudo
      // haberse pedido con la sesión anterior: lo invalidamos para no filtrar
      // datos de un usuario a otro en la misma pestaña.
      queryClient.invalidateQueries()
    },
  })

  return {
    user,
    isCheckingSession: meQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
