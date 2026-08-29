'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'

export function useAcceptJobApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => jobApplicationsApi.accept(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-requests', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
    },
  })
}
