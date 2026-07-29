'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserRound,
  Loader2,
} from 'lucide-react'
import { useFeed } from '@/hooks/use-feed'
import type { PostResponse } from '@/lib/posts/types'
import { useUserMode } from './user-mode'
import { cn } from '@/lib/utils'

const RELATIVE_TIME = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

function formatRelativeTime(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / 60_000)
  if (Math.abs(diffMinutes) < 60) return RELATIVE_TIME.format(diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return RELATIVE_TIME.format(diffHours, 'hour')
  const diffDays = Math.round(diffHours / 24)
  return RELATIVE_TIME.format(diffDays, 'day')
}

function SocialButton({
  icon: Icon,
  label,
  active,
  activeClass,
  onClick,
}: {
  icon: typeof Heart
  label: string
  active?: boolean
  activeClass?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="flex flex-col items-center gap-1 outline-none"
    >
      <span
        className={cn(
          'flex size-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-md ring-1 ring-white/10 transition-transform active:scale-90',
          active && activeClass,
        )}
      >
        <Icon className={cn('size-6 text-white', active && 'fill-current')} />
      </span>
    </button>
  )
}

function FeedCard({ post }: { post: PostResponse }) {
  const { mode } = useUserMode()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const isPro = mode === 'pro'

  return (
    <article className="snap-start-always relative h-[100dvh] w-full shrink-0 md:h-full">
      <Image
        src={post.mediaUrl || '/placeholder.svg'}
        alt={post.caption ?? 'Trabajo publicado por un profesional'}
        fill
        priority
        sizes="(min-width: 768px) 480px, 100vw"
        className="object-cover"
      />
      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

      {/* Right-side social rail */}
      <div className="absolute bottom-28 right-3 z-10 flex flex-col items-center gap-4 md:bottom-32">
        <SocialButton
          icon={Heart}
          label="Me gusta"
          active={liked}
          activeClass="text-accent"
          onClick={() => setLiked((v) => !v)}
        />
        <SocialButton icon={MessageCircle} label="Comentar" />
        <SocialButton icon={Share2} label="Compartir" />
        <SocialButton
          icon={Bookmark}
          label="Guardar"
          active={saved}
          activeClass="text-primary"
          onClick={() => setSaved((v) => !v)}
        />
      </div>

      {/* Bottom info + CTA */}
      <div className="absolute inset-x-0 bottom-20 z-10 px-4 pr-20 md:bottom-24">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-black/35 ring-2 ring-white/70">
            <UserRound className="size-6 text-white" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {post.authorUsername}
              {post.authorPrimaryCategory ? (
                <span className="font-normal text-white/70"> · {post.authorPrimaryCategory}</span>
              ) : null}
            </p>
            <p className="truncate text-sm text-white/70">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>

        {post.caption ? (
          <p className="mt-3 text-pretty text-sm text-white/90">{post.caption}</p>
        ) : null}

        {isPro ? (
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-transform active:scale-[0.98] md:max-w-xs"
          >
            <UserRound className="size-4" />
            Ver perfil
          </button>
        ) : (
          <button
            type="button"
            className="oficia-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] md:max-w-xs"
          >
            Solicitar Presupuesto
          </button>
        )}
      </div>
    </article>
  )
}

export function FeedView() {
  const feedQuery = useFeed()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const posts = useMemo(
    () => feedQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [feedQuery.data],
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
          feedQuery.fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [feedQuery.hasNextPage, feedQuery.isFetchingNextPage, feedQuery.fetchNextPage])

  if (feedQuery.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (feedQuery.isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-destructive">
          No pudimos cargar el feed. Probá de nuevo en un momento.
        </p>
        <button
          type="button"
          onClick={() => feedQuery.refetch()}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Todavía no hay publicaciones para mostrar.
      </div>
    )
  }

  return (
    <div className="no-scrollbar snap-y-mandatory h-full overflow-y-auto">
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {feedQuery.isFetchingNextPage ? (
        <div className="flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : null}
    </div>
  )
}
