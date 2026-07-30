'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/infrastructure/http/auth-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'
import type { LoginPayload, RegisterPayload } from '@/domain/auth/types'

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const

/**
 * Single entry point for session from components.
 * Combines TanStack Query (network + cache) with Zustand (UI profile state).
 */
export function useAuth() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  // Session bootstrap: cookie httpOnly validity via GET /api/users/me.
  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => {
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
      return currentUser
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (authUser) => {
      setUser(authUser)
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, authUser)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setUser(null)
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
      // Invalidate cached data tied to the previous session.
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
