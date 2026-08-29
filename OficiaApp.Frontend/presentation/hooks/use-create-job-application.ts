'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateJobApplicationPayload } from '@/domain/job-applications/types'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'

export function useCreateJobApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateJobApplicationPayload) => jobApplicationsApi.apply(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-requests', 'open'] })
    },
  })
}
