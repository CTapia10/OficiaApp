'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BadgeCheck,
  UserRound,
} from 'lucide-react'
import { feedPosts, type FeedPost } from '@/lib/oficia-data'
import { useUserMode } from './user-mode'
import { cn } from '@/lib/utils'

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return String(n)
}

function SocialButton({
  icon: Icon,
  label,
  count,
  active,
  activeClass,
  onClick,
}: {
  icon: typeof Heart
  label: string
  count?: string
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
        <Icon
          className={cn('size-6 text-white', active && 'fill-current')}
        />
      </span>
      {count ? (
        <span className="text-xs font-semibold text-white drop-shadow">
          {count}
        </span>
      ) : null}
    </button>
  )
}

function FeedCard({ post }: { post: FeedPost }) {
  const { mode } = useUserMode()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const isPro = mode === 'pro'

  return (
    <article className="snap-start-always relative h-[100dvh] w-full shrink-0 md:h-full">
      <Image
        src={post.cover || '/placeholder.svg'}
        alt={`Trabajo de ${post.rubro} realizado por ${post.proName}`}
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
          count={formatCount(post.likes + (liked ? 1 : 0))}
          active={liked}
          activeClass="text-accent"
          onClick={() => setLiked((v) => !v)}
        />
        <SocialButton
          icon={MessageCircle}
          label="Comentar"
          count={formatCount(post.comments)}
        />
        <SocialButton
          icon={Share2}
          label="Compartir"
          count={formatCount(post.shares)}
        />
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
          <Image
            src={post.proAvatar || '/placeholder.svg'}
            alt={post.proName}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-2 ring-white/70"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate font-semibold text-white">
                {post.proName}
              </p>
              <BadgeCheck className="size-4 shrink-0 text-primary" />
            </div>
            <p className="truncate text-sm text-white/70">{post.rubro}</p>
          </div>
        </div>

        <p className="mt-3 text-pretty text-sm text-white/90">
          {post.description}
        </p>
        <p className="mt-1 text-sm font-medium text-primary">
          {post.hashtags.join(' ')}
        </p>

        {isPro ? (
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-transform active:scale-[0.98] md:max-w-xs"
          >
            <UserRound className="size-4" />
            Ver perfil de {post.proName.split(' ')[0]}
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
  return (
    <div className="no-scrollbar snap-y-mandatory h-full overflow-y-auto">
      {feedPosts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  )
}
