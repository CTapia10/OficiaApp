'use client'

import { useMutation } from '@tanstack/react-query'
import type { CreateProfessionalProfilePayload } from '@/domain/profiles/types'
import { professionalProfileApi } from '@/infrastructure/http/professional-profile-api.adapter'

export function useCreateProfessionalProfile() {
  return useMutation({
    mutationFn: async (payload: CreateProfessionalProfilePayload & { categoryId: string }) => {
      const { categoryId, ...profile } = payload
      await professionalProfileApi.createProfile(profile)
      await professionalProfileApi.addCategory(categoryId)
    },
  })
}
