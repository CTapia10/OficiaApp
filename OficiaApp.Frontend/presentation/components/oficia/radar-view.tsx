'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Send, Clock, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '@/presentation/hooks/use-auth'
import { useOpenJobRequests } from '@/presentation/hooks/use-open-job-requests'
import type { JobRequestResponse } from '@/domain/job-requests/types'

function JobCard({ job }: { job: JobRequestResponse }) {
  const postedAt = new Date(job.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {job.status}
        </span>
      </div>

      <h3 className="mt-3 text-pretty text-base font-semibold leading-snug">{job.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" />
          {postedAt}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          className="oficia-gradient flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95"
        >
          <Send className="size-4" />
          Enviar cotización
        </button>
      </div>
    </article>
  )
}

function RadarAuthGate() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-8 text-center">
      <LogIn className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Iniciá sesión desde tu perfil para ver las solicitudes de trabajo cerca tuyo.
      </p>
    </div>
  )
}

export function RadarView() {
  const { user, isCheckingSession } = useAuth()
  const jobRequestsQuery = useOpenJobRequests()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const jobs = useMemo(
    () => jobRequestsQuery.data?.pages.flat() ?? [],
    [jobRequestsQuery.data],
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && jobRequestsQuery.hasNextPage && !jobRequestsQuery.isFetchingNextPage) {
          jobRequestsQuery.fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [jobRequestsQuery.hasNextPage, jobRequestsQuery.isFetchingNextPage, jobRequestsQuery.fetchNextPage])

  const openCountLabel = jobRequestsQuery.isLoading
    ? '…'
    : jobRequestsQuery.hasNextPage
      ? `${jobs.length}+`
      : String(jobs.length)

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
      <header className="mb-5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <h1 className="font-display text-2xl font-bold">Radar de trabajos</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Solicitudes de clientes cerca tuyo. Postulate antes que la competencia.
        </p>
      </header>

      {isCheckingSession ? (
        <div className="animate-pulse rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Cargando…
        </div>
      ) : !user ? (
        <RadarAuthGate />
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <div className="flex-1 rounded-2xl border border-border bg-card p-3 text-center">
              <p className="font-display text-xl font-bold text-foreground">{openCountLabel}</p>
              <p className="text-xs text-muted-foreground">Abiertas</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {jobRequestsQuery.isError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
                No pudimos cargar las solicitudes. Probá de nuevo en un momento.
              </div>
            )}

            {!jobRequestsQuery.isLoading && !jobRequestsQuery.isError && jobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No hay solicitudes abiertas por el momento.
              </div>
            )}

            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            <div ref={sentinelRef} aria-hidden className="h-px w-full" />
            {jobRequestsQuery.isFetchingNextPage ? (
              <div className="flex justify-center py-4">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
