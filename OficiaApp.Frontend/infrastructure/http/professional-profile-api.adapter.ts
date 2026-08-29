import type { ProfessionalProfileApiPort } from '@/application/ports/out/professional-profile-api.port'
import type { CreateProfessionalProfilePayload } from '@/domain/profiles/types'
import { apiFetch } from './api-client'

export const professionalProfileApi: ProfessionalProfileApiPort = {
  createProfile(payload: CreateProfessionalProfilePayload): Promise<void> {
    return apiFetch<void>('/api/professional-profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  addCategory(categoryId: string): Promise<void> {
    return apiFetch<void>(`/api/professional-profile/categories/${categoryId}`, {
      method: 'POST',
    })
  },
}
