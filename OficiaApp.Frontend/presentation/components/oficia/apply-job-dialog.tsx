'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { useCreateJobApplication } from '@/presentation/hooks/use-create-job-application'
import { ProOnboardingForm } from '@/presentation/components/oficia/pro-onboarding-form'
import { ApiError } from '@/infrastructure/http/api-error'
import type { JobRequestResponse } from '@/domain/job-requests/types'

type ApplyJobDialogProps = {
  job: JobRequestResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

function fieldError(error: unknown): string | null {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return null
}

export function ApplyJobDialog({ job, open, onOpenChange }: ApplyJobDialogProps) {
  const applyMutation = useCreateJobApplication()
  const [proposedPrice, setProposedPrice] = useState('')
  const [needsProfessionalProfile, setNeedsProfessionalProfile] = useState(false)

  if (!open) return null

  async function submitQuote() {
    const price = Number(proposedPrice)
    if (!Number.isFinite(price) || price <= 0) return

    try {
      await applyMutation.mutateAsync({
        jobRequestId: job.id,
        proposedPrice: price,
      })
      setProposedPrice('')
      setNeedsProfessionalProfile(false)
      onOpenChange(false)
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.message.toLowerCase().includes('professional profile')
      ) {
        setNeedsProfessionalProfile(true)
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await submitQuote()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-job-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="apply-job-title" className="font-display text-lg font-bold">
              Enviar cotización
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{job.title}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {needsProfessionalProfile && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-sm text-amber-200">
              Necesitás un perfil profesional para postularte.
            </p>
            <ProOnboardingForm
              onSuccess={() => {
                setNeedsProfessionalProfile(false)
                void submitQuote()
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="apply-price" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Precio propuesto ($)
            </label>
            <input
              id="apply-price"
              type="number"
              required
              min={0.01}
              step="0.01"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="15000"
            />
          </div>

          {applyMutation.error && !needsProfessionalProfile && (
            <p className="text-sm text-destructive">
              {fieldError(applyMutation.error) ?? 'No pudimos enviar la cotización.'}
            </p>
          )}

          <button
            type="submit"
            disabled={applyMutation.isPending}
            className="oficia-gradient mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {applyMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando…
              </>
            ) : (
              'Enviar cotización'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
