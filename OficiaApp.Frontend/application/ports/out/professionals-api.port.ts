import type { Professional, SearchProfessionalsFilters } from '@/domain/professionals/types'

export interface ProfessionalsApiPort {
  search(filters?: SearchProfessionalsFilters): Promise<Professional[]>
}
