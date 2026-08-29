import type { ClientProfileApiPort } from '@/application/ports/out/client-profile-api.port'
import type { CreateClientProfilePayload } from '@/domain/profiles/types'
import { apiFetch } from './api-client'

export const clientProfileApi: ClientProfileApiPort = {
  createProfile(payload: CreateClientProfilePayload): Promise<void> {
    return apiFetch<void>('/api/client-profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
