'use client'

import { useQuery } from '@tanstack/react-query'
import { categoriesService } from '@/lib/categories/categories-service'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    staleTime: 10 * 60 * 1000, // las categorías casi no cambian; cache larga.
  })
}
