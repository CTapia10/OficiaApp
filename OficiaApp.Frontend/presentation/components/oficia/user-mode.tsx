'use client'

import { createContext, useContext, useState } from 'react'

export type UserMode = 'client' | 'pro'

type UserModeContextValue = {
  /** El usuario tiene el perfil profesional habilitado */
  isPro: boolean
  /** Modo activo actual (solo cambia entre pro y client si isPro) */
  mode: UserMode
  setMode: (mode: UserMode) => void
  /** Activa el perfil profesional y cambia al modo pro */
  activatePro: () => void
}

const UserModeContext = createContext<UserModeContextValue | null>(null)

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  // Todos los usuarios arrancan como clientes, sin perfil profesional.
  const [isPro, setIsPro] = useState(false)
  const [mode, setMode] = useState<UserMode>('client')

  function activatePro() {
    setIsPro(true)
    setMode('pro')
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
