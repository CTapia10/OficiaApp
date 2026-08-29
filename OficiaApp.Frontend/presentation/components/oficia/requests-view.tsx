'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Plus, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '@/presentation/hooks/use-auth'
import { useMyJobRequests } from '@/presentation/hooks/use-my-job-requests'
import { useCategories } from '@/presentation/hooks/use-categories'
import { useAppNavigation } from '@/presentation/context/app-navigation'
import { AuthGate } from '@/presentation/components/oficia/auth-gate'
import { cn } from '@/presentation/lib/utils'
import type { JobRequestStatus } from '@/domain/job-requests/types'

const STATUS_META: Record<JobRequestStatus, { label: string; className: string }> = {
  Pending: { label: 'Pendiente', className: 'bg-primary/15 text-primary' },
  Accepted: { label: 'Aceptada', className: 'bg-amber-500/15 text-amber-400' },
  InProgress: { label: 'En curso', className: 'bg-amber-500/15 text-amber-400' },
  Rejected: { label: 'Rechazada', className: 'bg-red-500/15 text-red-400' },
  Completed: { label: 'Completada', className: 'bg-emerald-500/15 text-emerald-400' },
  Cancelled: { label: 'Cancelada', className: 'bg-red-500/15 text-red-400' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export function RequestsView() {
  const { user, isCheckingSession } = useAuth()
  const jobRequestsQuery = useMyJobRequests()
  const categoriesQuery = useCategories()
  const { openCreateJobRequest } = useAppNavigation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const requests = useMemo(
    () => jobRequestsQuery.data?.pages.flat() ?? [],
    [jobRequestsQuery.data],
  )

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const category of categoriesQuery.data ?? []) {
      map.set(category.id, category.name)
    }
    return map
  }, [categoriesQuery.data])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          jobRequestsQuery.hasNextPage &&
          !jobRequestsQuery.isFetchingNextPage
        ) {
          jobRequestsQuery.fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [
    jobRequestsQuery.hasNextPage,
    jobRequestsQuery.isFetchingNextPage,
    jobRequestsQuery.fetchNextPage,
  ])

  if (isCheckingSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
        <header className="mb-5">
          <h1 className="font-display text-2xl font-bold tracking-tight">Mis solicitudes</h1>
          <p className="text-sm text-muted-foreground">Seguí el estado de tus pedidos</p>
        </header>
        <AuthGate />
      </div>
    )
  }

  if (jobRequestsQuery.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (jobRequestsQuery.isError) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-destructive">
        No pudimos cargar tus solicitudes. Probá de nuevo en un momento.
      </div>
    )
  }

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Mis solicitudes
          </h1>
          <p className="text-sm text-muted-foreground">
            Seguí el estado de tus pedidos
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateJobRequest}
          className="oficia-gradient flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </header>

      {requests.length === 0 ? (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Todavía no creaste ninguna solicitud.
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-medium text-primary">
                    {categoryNameById.get(r.categoryId) ?? 'Categoría'}
                  </span>
                  <h2 className="mt-0.5 font-semibold leading-tight text-pretty">
                    {r.title}
                  </h2>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                    STATUS_META[r.status]?.className,
                  )}
                >
                  {STATUS_META[r.status]?.label ?? r.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {formatDate(r.createdAt)}
              </div>
            </li>
          ))}
          <div ref={sentinelRef} aria-hidden className="h-px w-full" />
          {jobRequestsQuery.isFetchingNextPage ? (
            <li className="flex justify-center py-4">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </li>
          ) : null}
        </ul>
      )}
    </div>
  )
}
