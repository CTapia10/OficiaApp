import type { CreateProfessionalProfilePayload } from '@/domain/profiles/types'

export interface ProfessionalProfileApiPort {
  createProfile(payload: CreateProfessionalProfilePayload): Promise<void>
  addCategory(categoryId: string): Promise<void>
}
