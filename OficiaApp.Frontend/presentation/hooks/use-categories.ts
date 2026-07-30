'use client'

import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/infrastructure/http/categories-api.adapter'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000, // categories rarely change; long cache.
  })
}
