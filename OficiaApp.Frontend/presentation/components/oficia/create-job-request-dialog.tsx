'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { useCategories } from '@/presentation/hooks/use-categories'
import { useCreateJobRequest } from '@/presentation/hooks/use-create-job-request'
import { useCreateClientProfile } from '@/presentation/hooks/use-create-client-profile'
import { ApiError } from '@/infrastructure/http/api-error'
import { cn } from '@/presentation/lib/utils'

type CreateJobRequestDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCategoryId?: string
}

function fieldError(error: unknown): string | null {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return null
}

export function CreateJobRequestDialog({
  open,
  onOpenChange,
  defaultCategoryId,
}: CreateJobRequestDialogProps) {
  const categoriesQuery = useCategories()
  const createMutation = useCreateJobRequest()
  const createClientProfileMutation = useCreateClientProfile()

  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [needsClientProfile, setNeedsClientProfile] = useState(false)

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!categoryId || !title.trim() || !description.trim()) return

    const imageUrls = imageUrlInput
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    try {
      await createMutation.mutateAsync({
        categoryId,
        title: title.trim(),
        description: description.trim(),
        imageUrls,
      })
      setTitle('')
      setDescription('')
      setImageUrlInput('')
      setPhoneNumber('')
      setNeedsClientProfile(false)
      if (!defaultCategoryId) setCategoryId('')
      onOpenChange(false)
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.message.toLowerCase().includes('client profile')
      ) {
        setNeedsClientProfile(true)
      }
    }
  }

  async function handleCreateClientProfile(e: FormEvent) {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    try {
      await createClientProfileMutation.mutateAsync({ phoneNumber: phoneNumber.trim() })
      setNeedsClientProfile(false)
    } catch {
      // Error surfaced via createClientProfileMutation.error
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-job-request-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="create-job-request-title" className="font-display text-lg font-bold">
              Nueva solicitud
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Contanos qué necesitás y los profesionales te van a cotizar.
            </p>
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

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          {needsClientProfile && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-200">
                Necesitás un perfil de cliente antes de publicar una solicitud.
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Tu teléfono"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleCreateClientProfile}
                  disabled={createClientProfileMutation.isPending}
                  className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-semibold"
                >
                  {createClientProfileMutation.isPending ? '…' : 'Guardar'}
                </button>
              </div>
              {createClientProfileMutation.error && (
                <p className="mt-2 text-xs text-destructive">
                  {fieldError(createClientProfileMutation.error)}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="jr-category" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Categoría
            </label>
            <select
              id="jr-category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="" disabled>
                Elegí un oficio
              </option>
              {categoriesQuery.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jr-title" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Título
            </label>
            <input
              id="jr-title"
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Ej. Arreglar canilla que pierde"
            />
          </div>

          <div>
            <label htmlFor="jr-description" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Descripción
            </label>
            <textarea
              id="jr-description"
              required
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Detallá el problema, ubicación aproximada, urgencia…"
            />
          </div>

          <div>
            <label htmlFor="jr-images" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              URLs de fotos (opcional, separadas por coma)
            </label>
            <input
              id="jr-images"
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="https://…"
            />
          </div>

          {createMutation.error && (
            <p className="text-sm text-destructive">
              {fieldError(createMutation.error) ?? 'No pudimos crear la solicitud.'}
            </p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className={cn(
              'oficia-gradient mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60',
            )}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creando…
              </>
            ) : (
              'Publicar solicitud'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
