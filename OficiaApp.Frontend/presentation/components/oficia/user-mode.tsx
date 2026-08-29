'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type UserMode = 'client' | 'pro'

const MODE_STORAGE_KEY = 'oficia_user_mode'
const IS_PRO_STORAGE_KEY = 'oficia_is_pro'

type UserModeContextValue = {
  isPro: boolean
  mode: UserMode
  setMode: (mode: UserMode) => void
  activatePro: () => void
}

const UserModeContext = createContext<UserModeContextValue | null>(null)

function readStoredMode(): UserMode {
  if (typeof window === 'undefined') return 'client'
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY)
  return stored === 'pro' ? 'pro' : 'client'
}

function readStoredIsPro(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(IS_PRO_STORAGE_KEY) === 'true'
}

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [mode, setModeState] = useState<UserMode>('client')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setIsPro(readStoredIsPro())
    setModeState(readStoredMode())
    setHydrated(true)
  }, [])

  function setMode(next: UserMode) {
    if (next === 'pro' && !isPro) return
    setModeState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODE_STORAGE_KEY, next)
    }
  }

  function activatePro() {
    setIsPro(true)
    setModeState('pro')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(IS_PRO_STORAGE_KEY, 'true')
      window.localStorage.setItem(MODE_STORAGE_KEY, 'pro')
    }
  }

  if (!hydrated) {
    return null
  }

  return (
    <UserModeContext.Provider value={{ isPro, mode, setMode, activatePro }}>
      {children}
    </UserModeContext.Provider>
  )
}

export function useUserMode() {
  const ctx = useContext(UserModeContext)
  if (!ctx) {
    throw new Error('useUserMode debe usarse dentro de UserModeProvider')
  }
  return ctx
}
