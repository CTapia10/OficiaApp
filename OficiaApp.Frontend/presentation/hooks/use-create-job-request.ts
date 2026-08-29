'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateJobRequestPayload } from '@/domain/job-requests/types'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'

export function useCreateJobRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateJobRequestPayload) => jobRequestsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-requests', 'my'] })
    },
  })
}
