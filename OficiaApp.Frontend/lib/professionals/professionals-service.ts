import { apiFetch } from '@/lib/api/api-client'
import type { Professional } from './types'

export type SearchProfessionalsFilters = {
  categoryId?: string
  maxHourlyRate?: number
}

export const professionalsService = {
  search(filters: SearchProfessionalsFilters = {}): Promise<Professional[]> {
    const params = new URLSearchParams()
    if (filters.categoryId) params.set('categoryId', filters.categoryId)
    if (filters.maxHourlyRate !== undefined) {
      params.set('maxHourlyRate', String(filters.maxHourlyRate))
    }
    const query = params.toString()
    return apiFetch<Professional[]>(
      `/api/professional-profile/search${query ? `?${query}` : ''}`,
    )
  },
}
