'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { useCreatePost } from '@/presentation/hooks/use-create-post'
import { ApiError } from '@/infrastructure/http/api-error'

type CreatePostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function fieldError(error: unknown): string | null {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return null
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const createMutation = useCreatePost()
  const [mediaUrl, setMediaUrl] = useState('')
  const [caption, setCaption] = useState('')

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!mediaUrl.trim()) return

    try {
      await createMutation.mutateAsync({
        mediaUrl: mediaUrl.trim(),
        caption: caption.trim() || null,
      })
      setMediaUrl('')
      setCaption('')
      onOpenChange(false)
    } catch {
      // Error surfaced via createMutation.error
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="create-post-title" className="font-display text-lg font-bold">
              Publicar trabajo
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Mostrá tu trabajo en el feed para atraer clientes.
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
          <div>
            <label htmlFor="post-media" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              URL de imagen o video
            </label>
            <input
              id="post-media"
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="https://…"
            />
          </div>

          <div>
            <label htmlFor="post-caption" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Descripción (opcional)
            </label>
            <textarea
              id="post-caption"
              rows={3}
              maxLength={500}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Contá qué hiciste en este trabajo…"
            />
          </div>

          {createMutation.error && (
            <p className="text-sm text-destructive">
              {fieldError(createMutation.error) ?? 'No pudimos publicar el trabajo.'}
            </p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="oficia-gradient mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Publicando…
              </>
            ) : (
              'Publicar en el feed'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
