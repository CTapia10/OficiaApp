'use client'

import Image from 'next/image'
import { Plus, MessageCircle, Clock, ChevronRight } from 'lucide-react'
import { clientRequests, type ClientRequest } from '@/lib/oficia-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<ClientRequest['status'], string> = {
  Activa: 'bg-primary/15 text-primary',
  'En curso': 'bg-amber-500/15 text-amber-400',
  Completada: 'bg-emerald-500/15 text-emerald-400',
}

export function RequestsView() {
  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Mis solicitudes
          </h1>
          <p className="text-sm text-muted-foreground">
            Seguí las cotizaciones de tus pedidos
          </p>
        </div>
        <button
          type="button"
          className="oficia-gradient flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </header>

      <ul className="mt-6 flex flex-col gap-3">
        {clientRequests.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-medium text-primary">
                  {r.category}
                </span>
                <h2 className="mt-0.5 font-semibold leading-tight text-pretty">
                  {r.title}
                </h2>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                  statusStyles[r.status],
                )}
              >
                {r.status}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {r.createdAt}
              </span>
              <span className="font-medium text-foreground">{r.budget}</span>
            </div>

            {r.proName ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5">
                <Image
                  src={r.proAvatar || '/placeholder.svg'}
                  alt={r.proName}
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {r.status === 'Completada' ? 'Realizado por' : 'Asignado a'}
                  </p>
                  <p className="truncate text-sm font-medium">{r.proName}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ) : (
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <MessageCircle className="size-4" />
                Ver {r.quotes} cotizaciones
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
