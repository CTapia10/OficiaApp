'use client'

import { useQuery } from '@tanstack/react-query'
import {
  professionalsService,
  type SearchProfessionalsFilters,
} from '@/lib/professionals/professionals-service'

export function useProfessionalsSearch(filters: SearchProfessionalsFilters) {
  return useQuery({
    // La queryKey incluye los filtros: TanStack Query cachea cada combinación
    // por separado y refetchea sola cuando `filters` cambia.
    queryKey: ['professionals', 'search', filters],
    queryFn: () => professionalsService.search(filters),
    placeholderData: (previousData) => previousData, // evita parpadeo al cambiar de filtro.
  })
}
