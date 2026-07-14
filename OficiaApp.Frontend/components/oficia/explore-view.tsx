'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Search, Star, MapPin, BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { categories, featuredPros } from '@/lib/oficia-data'
import { cn } from '@/lib/utils'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </span>
  )
}

export function ExploreView() {
  const [active, setActive] = useState('Todos')
  const [query, setQuery] = useState('')

  const pros = useMemo(() => {
    return featuredPros.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.rubro.toLowerCase().includes(query.toLowerCase())
      return matchesQuery
    })
  }, [query])

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
      <header className="mb-5">
        <h1 className="font-display text-2xl font-bold text-balance">
          Encontrá al profesional ideal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buscá por oficio, nombre o zona.
        </p>
      </header>

      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Search className="size-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué necesitás hoy?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          aria-label="Filtros"
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </div>

      {/* Category pills */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active === cat
                ? 'oficia-gradient text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured pros */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          Perfiles destacados
        </h2>
        <span className="text-xs text-muted-foreground">
          {pros.length} resultados
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {pros.map((pro) => (
          <li key={pro.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
            >
              <Image
                src={pro.avatar || '/placeholder.svg'}
                alt={pro.name}
                width={60}
                height={60}
                className="size-15 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate font-semibold">{pro.name}</p>
                  {pro.verified && (
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{pro.rubro}</p>
                <div className="mt-1 flex items-center gap-3">
                  <Stars rating={pro.rating} />
                  <span className="text-xs text-muted-foreground">
                    ({pro.reviews})
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {pro.location}
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
        {pros.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No encontramos profesionales para “{query}”.
          </li>
        )}
      </ul>
    </div>
  )
}
