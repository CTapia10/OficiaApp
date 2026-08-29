import type { CreateClientProfilePayload } from '@/domain/profiles/types'

export interface ClientProfileApiPort {
  createProfile(payload: CreateClientProfilePayload): Promise<void>
}
