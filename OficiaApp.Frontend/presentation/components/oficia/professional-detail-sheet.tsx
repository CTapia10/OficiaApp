'use client'

import { Briefcase, MapPin, X } from 'lucide-react'
import type { Professional } from '@/domain/professionals/types'

type ProfessionalDetailSheetProps = {
  professional: Professional | null
  onClose: () => void
  onContact: () => void
}

export function ProfessionalDetailSheet({
  professional,
  onClose,
  onContact,
}: ProfessionalDetailSheetProps) {
  if (!professional) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pro-detail-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="pro-detail-title" className="truncate font-display text-lg font-bold">
              {professional.username}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{professional.bio}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <Briefcase className="size-4" />
            {professional.yearsOfExperience} años exp.
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <MapPin className="size-4" />${professional.hourlyRate}/h
          </span>
        </div>

        {professional.categories.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">Oficios</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {professional.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onContact}
          className="oficia-gradient mt-5 w-full rounded-xl py-3 text-sm font-bold text-primary-foreground"
        >
          Contactar / Solicitar servicio
        </button>
      </div>
    </div>
  )
}
