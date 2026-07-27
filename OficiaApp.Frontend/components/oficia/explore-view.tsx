'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Search, Briefcase, MapPin, BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { useCategories } from '@/hooks/use-categories'
import { useProfessionalsSearch } from '@/hooks/use-professionals-search'
import { cn } from '@/lib/utils'

const ALL_CATEGORY_ID = 'all'

export function ExploreView() {
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY_ID)
  const [query, setQuery] = useState('')

  const categoriesQuery = useCategories()
  const professionalsQuery = useProfessionalsSearch({
    categoryId: activeCategoryId === ALL_CATEGORY_ID ? undefined : activeCategoryId,
  })

  const pros = useMemo(() => {
    const results = professionalsQuery.data ?? []
    if (!query) return results
    const q = query.toLowerCase()
    return results.filter(
      (p) => p.username.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q),
    )
  }, [professionalsQuery.data, query])

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
        <button
          type="button"
          onClick={() => setActiveCategoryId(ALL_CATEGORY_ID)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeCategoryId === ALL_CATEGORY_ID
              ? 'oficia-gradient text-primary-foreground'
              : 'border border-border bg-card text-muted-foreground hover:text-foreground',
          )}
        >
          Todos
        </button>
        {categoriesQuery.data?.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategoryId(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeCategoryId === cat.id
                ? 'oficia-gradient text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured pros */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Perfiles destacados</h2>
        <span className="text-xs text-muted-foreground">
          {professionalsQuery.isLoading ? '…' : `${pros.length} resultados`}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {professionalsQuery.isError && (
          <li className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            No pudimos cargar los profesionales. Probá de nuevo en un momento.
          </li>
        )}

        {pros.map((pro) => (
          <li key={pro.profileId}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
            >
              <Image
                src="/placeholder.svg"
                alt={pro.username}
                width={60}
                height={60}
                className="size-15 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate font-semibold">{pro.username}</p>
                  {pro.yearsOfExperience >= 5 && (
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">{pro.bio}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="size-3.5" />
                    {pro.yearsOfExperience} años exp.
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    ${pro.hourlyRate}/h
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}

        {!professionalsQuery.isLoading && !professionalsQuery.isError && pros.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No encontramos profesionales para “{query || 'esta categoría'}”.
          </li>
        )}
      </ul>
    </div>
  )
}
