'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type TabId = 'inicio' | 'explorar' | 'radar' | 'solicitudes' | 'perfil'

type AppNavigationContextValue = {
  exploreQuery: string
  setExploreQuery: (query: string) => void
  createJobRequestOpen: boolean
  openCreateJobRequest: () => void
  closeCreateJobRequest: () => void
  createPostOpen: boolean
  openCreatePost: () => void
  closeCreatePost: () => void
  navigate: (tab: TabId) => void
  registerNavigate: (fn: (tab: TabId) => void) => void
}

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null)

export function AppNavigationProvider({ children }: { children: React.ReactNode }) {
  const [exploreQuery, setExploreQuery] = useState('')
  const [createJobRequestOpen, setCreateJobRequestOpen] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [navigateFn, setNavigateFn] = useState<((tab: TabId) => void) | null>(null)

  const registerNavigate = useCallback((fn: (tab: TabId) => void) => {
    setNavigateFn(() => fn)
  }, [])

  const navigate = useCallback(
    (tab: TabId) => {
      navigateFn?.(tab)
    },
    [navigateFn],
  )

  const value = useMemo(
    () => ({
      exploreQuery,
      setExploreQuery,
      createJobRequestOpen,
      openCreateJobRequest: () => setCreateJobRequestOpen(true),
      closeCreateJobRequest: () => setCreateJobRequestOpen(false),
      createPostOpen,
      openCreatePost: () => setCreatePostOpen(true),
      closeCreatePost: () => setCreatePostOpen(false),
      navigate,
      registerNavigate,
    }),
    [exploreQuery, createJobRequestOpen, createPostOpen, navigate, registerNavigate],
  )

  return <AppNavigationContext.Provider value={value}>{children}</AppNavigationContext.Provider>
}

export function useAppNavigation() {
  const ctx = useContext(AppNavigationContext)
  if (!ctx) {
    throw new Error('useAppNavigation must be used within AppNavigationProvider')
  }
  return ctx
}
