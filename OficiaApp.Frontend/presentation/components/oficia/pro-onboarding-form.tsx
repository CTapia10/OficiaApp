'use client'

import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { useCategories } from '@/presentation/hooks/use-categories'
import { useCreateProfessionalProfile } from '@/presentation/hooks/use-create-professional-profile'
import { ApiError } from '@/infrastructure/http/api-error'

type ProOnboardingFormProps = {
  onSuccess: () => void
}

function fieldError(error: unknown): string | null {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return null
}

export function ProOnboardingForm({ onSuccess }: ProOnboardingFormProps) {
  const categoriesQuery = useCategories()
  const createMutation = useCreateProfessionalProfile()

  const [bio, setBio] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('3')
  const [hourlyRate, setHourlyRate] = useState('')
  const [categoryId, setCategoryId] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!bio.trim() || !categoryId || !hourlyRate) return

    try {
      await createMutation.mutateAsync({
        bio: bio.trim(),
        yearsOfExperience: Number(yearsOfExperience),
        hourlyRate: Number(hourlyRate),
        categoryId,
      })
      onSuccess()
    } catch {
      // Error surfaced via createMutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <div>
        <label htmlFor="pro-bio" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Bio profesional
        </label>
        <textarea
          id="pro-bio"
          required
          rows={3}
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Contá tu experiencia y especialidades…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pro-years" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Años de experiencia
          </label>
          <input
            id="pro-years"
            type="number"
            required
            min={0}
            max={60}
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="pro-rate" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Tarifa por hora ($)
          </label>
          <input
            id="pro-rate"
            type="number"
            required
            min={1}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="15000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="pro-category" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Oficio principal
        </label>
        <select
          id="pro-category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="" disabled>
            Elegí una categoría
          </option>
          {categoriesQuery.data?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {createMutation.error && (
        <p className="text-sm text-destructive">
          {fieldError(createMutation.error) ?? 'No pudimos activar tu perfil profesional.'}
        </p>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="oficia-gradient flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {createMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Activando…
          </>
        ) : (
          'Activar perfil profesional'
        )}
      </button>
    </form>
  )
}
