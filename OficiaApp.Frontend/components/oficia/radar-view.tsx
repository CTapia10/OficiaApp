'use client'

import { MapPin, Zap, Send, Clock, Users } from 'lucide-react'
import { jobRequests, type JobRequest } from '@/lib/oficia-data'
import { cn } from '@/lib/utils'

const urgencyStyles: Record<JobRequest['urgency'], string> = {
  Urgente: 'bg-destructive/15 text-destructive ring-destructive/30',
  'Esta semana': 'bg-amber-400/15 text-amber-400 ring-amber-400/30',
  Flexible: 'bg-emerald-400/15 text-emerald-400 ring-emerald-400/30',
}

function JobCard({ job }: { job: JobRequest }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {job.category}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
            urgencyStyles[job.urgency],
          )}
        >
          {job.urgency === 'Urgente' && <Zap className="size-3.5" />}
          {job.urgency}
        </span>
      </div>

      <h3 className="mt-3 text-pretty text-base font-semibold leading-snug">
        {job.title}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" />
          {job.zone} · {job.distance}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" />
          {job.postedAt}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-4" />
          {job.applicants} postulados
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Presupuesto est.</p>
          <p className="font-display font-semibold oficia-gradient-text">
            {job.budget}
          </p>
        </div>
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

export function RadarView() {
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

      <div className="mb-4 flex gap-2">
        <div className="flex-1 rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold text-foreground">
            {jobRequests.length}
          </p>
          <p className="text-xs text-muted-foreground">Nuevas hoy</p>
        </div>
        <div className="flex-1 rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold oficia-gradient-text">
            94%
          </p>
          <p className="text-xs text-muted-foreground">Tasa de match</p>
        </div>
        <div className="flex-1 rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-xl font-bold text-foreground">
            4.9
          </p>
          <p className="text-xs text-muted-foreground">Tu rating</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {jobRequests.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
