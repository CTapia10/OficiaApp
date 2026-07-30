'use client'

import { useQuery } from '@tanstack/react-query'
import { professionalsApi } from '@/infrastructure/http/professionals-api.adapter'
import type { SearchProfessionalsFilters } from '@/domain/professionals/types'

export function useProfessionalsSearch(filters: SearchProfessionalsFilters) {
  return useQuery({
    // queryKey includes filters: each combination is cached separately.
    queryKey: ['professionals', 'search', filters],
    queryFn: () => professionalsApi.search(filters),
    placeholderData: (previousData) => previousData, // avoid flicker on filter change.
  })
}
