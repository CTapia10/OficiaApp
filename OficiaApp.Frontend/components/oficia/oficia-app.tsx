'use client'

import { useState } from 'react'
import {
  Home,
  Compass,
  Radar,
  User,
  Bell,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'
import { FeedView } from './feed-view'
import { ExploreView } from './explore-view'
import { RadarView } from './radar-view'
import { RequestsView } from './requests-view'
import { ProfileView } from './profile-view'
import { ModeSwitch } from './mode-switch'
import { UserModeProvider, useUserMode } from './user-mode'
import { cn } from '@/lib/utils'

type TabId = 'inicio' | 'explorar' | 'radar' | 'solicitudes' | 'perfil'

const clientTabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'explorar', label: 'Explorar', icon: Compass },
  { id: 'solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { id: 'perfil', label: 'Perfil', icon: User },
]

const proTabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'explorar', label: 'Explorar', icon: Compass },
  { id: 'radar', label: 'Radar', icon: Radar },
  { id: 'perfil', label: 'Perfil', icon: User },
]

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="oficia-gradient flex size-8 items-center justify-center rounded-xl font-display text-lg font-black text-primary-foreground">
        O
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Oficia
      </span>
    </div>
  )
}

function AppShell() {
  const { mode, isPro } = useUserMode()
  const [tab, setTab] = useState<TabId>('inicio')

  const tabs = mode === 'pro' ? proTabs : clientTabs

  // Si el tab activo no existe en el modo actual, volver a inicio.
  const activeTab: TabId = tabs.some((t) => t.id === tab) ? tab : 'inicio'

  const views: Record<TabId, React.ReactNode> = {
    inicio: <FeedView />,
    explorar: <ExploreView />,
    radar: <RadarView />,
    solicitudes: <RequestsView />,
    perfil: <ProfileView onNavigate={setTab} />,
  }

  const isFeed = activeTab === 'inicio'

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background md:mx-auto md:max-w-6xl md:border-x md:border-border">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 md:flex">
        <Logo className="px-2" />

        {isPro && (
          <div className="mt-6">
            <ModeSwitch />
          </div>
        )}

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {tabs.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
                )}
              >
                <t.icon className={cn('size-5', active && 'text-primary')} />
                {t.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          className="oficia-gradient mt-auto rounded-xl py-3 text-sm font-bold text-primary-foreground"
        >
          {mode === 'pro' ? 'Publicar mi trabajo' : 'Solicitar servicio'}
        </button>
      </aside>

      {/* Main column */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (hidden on feed for immersion) */}
        <header
          className={cn(
            'z-20 flex items-center justify-between px-4 py-3 md:hidden',
            isFeed
              ? 'absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent'
              : 'border-b border-border bg-background',
          )}
        >
          <Logo />
          <div className="flex items-center gap-2">
            {isPro && <ModeSwitch compact dark={isFeed} />}
            <button
              type="button"
              aria-label="Notificaciones"
              className={cn(
                'relative flex size-9 items-center justify-center rounded-full',
                isFeed ? 'text-white' : 'text-foreground',
              )}
            >
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        {/* Active view */}
        <main className="min-h-0 flex-1">{views[activeTab]}</main>

        {/* Mobile bottom navigation */}
        <nav
          className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-white/10 bg-background/80 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden"
          aria-label="Navegación principal"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5"
              >
                <t.icon
                  className={cn(
                    'size-6 transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] font-medium transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {t.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function OficiaApp() {
  return (
    <UserModeProvider>
      <AppShell />
    </UserModeProvider>
  )
}
