'use client'

import { User, Wrench } from 'lucide-react'
import { useUserMode, type UserMode } from './user-mode'
import { cn } from '@/lib/utils'

const options: { id: UserMode; label: string; icon: typeof User }[] = [
  { id: 'client', label: 'Cliente', icon: User },
  { id: 'pro', label: 'Profesional', icon: Wrench },
]

export function ModeSwitch({
  compact = false,
  dark = false,
}: {
  compact?: boolean
  dark?: boolean
}) {
  const { mode, setMode } = useUserMode()

  return (
    <div
      role="group"
      aria-label="Cambiar modo de uso"
      className={cn(
        'inline-flex items-center rounded-full p-1',
        dark ? 'bg-black/40 backdrop-blur-md' : 'bg-secondary',
        !compact && 'w-full',
      )}
    >
      {options.map((o) => {
        const active = mode === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setMode(o.id)}
            aria-pressed={active}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors',
              compact ? 'px-2.5 py-1.5 text-xs' : 'flex-1 px-3 py-2 text-sm',
              active
                ? 'oficia-gradient text-primary-foreground'
                : dark
                  ? 'text-white/80'
                  : 'text-muted-foreground',
            )}
          >
            <o.icon className={cn(compact ? 'size-3.5' : 'size-4')} />
            {(!compact || active) && <span>{o.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
