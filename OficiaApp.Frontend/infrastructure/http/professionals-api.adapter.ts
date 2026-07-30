import type { ProfessionalsApiPort } from '@/application/ports/out/professionals-api.port'
import type { Professional, SearchProfessionalsFilters } from '@/domain/professionals/types'
import { apiFetch } from './api-client'

export const professionalsApi: ProfessionalsApiPort = {
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
