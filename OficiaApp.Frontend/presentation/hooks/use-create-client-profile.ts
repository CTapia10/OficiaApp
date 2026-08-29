'use client'

import { useMutation } from '@tanstack/react-query'
import type { CreateClientProfilePayload } from '@/domain/profiles/types'
import { clientProfileApi } from '@/infrastructure/http/client-profile-api.adapter'

export function useCreateClientProfile() {
  return useMutation({
    mutationFn: (payload: CreateClientProfilePayload) => clientProfileApi.createProfile(payload),
  })
}
