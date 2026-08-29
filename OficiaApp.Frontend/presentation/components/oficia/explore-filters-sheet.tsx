'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type ExploreFiltersSheetProps = {
  open: boolean
  maxHourlyRate: number | undefined
  onApply: (maxHourlyRate: number | undefined) => void
  onClose: () => void
}

export function ExploreFiltersSheet({
  open,
  maxHourlyRate,
  onApply,
  onClose,
}: ExploreFiltersSheetProps) {
  const [rateInput, setRateInput] = useState(
    maxHourlyRate !== undefined ? String(maxHourlyRate) : '',
  )

  if (!open) return null

  function handleApply() {
    const parsed = rateInput.trim() ? Number(rateInput) : undefined
    onApply(Number.isFinite(parsed) && parsed! > 0 ? parsed : undefined)
    onClose()
  }

  function handleClear() {
    setRateInput('')
    onApply(undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="explore-filters-title"
        className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="explore-filters-title" className="font-display text-lg font-bold">
              Filtros
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Ajustá la búsqueda de profesionales.
            </p>
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

        <div className="mt-4">
          <label htmlFor="max-rate" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Tarifa máxima por hora ($)
          </label>
          <input
            id="max-rate"
            type="number"
            min={1}
            value={rateInput}
            onChange={(e) => setRateInput(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Sin límite"
          />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="oficia-gradient flex-1 rounded-xl py-3 text-sm font-bold text-primary-foreground"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
