'use client'

import { useQuery } from '@tanstack/react-query'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'

const DEFAULT_PAGE_SIZE = 50

export function useJobApplications(jobRequestId: string | null, pageSize = DEFAULT_PAGE_SIZE) {
  const status = useAuthStore((s) => s.status)

  return useQuery({
    queryKey: ['job-applications', jobRequestId, pageSize],
    queryFn: () => jobApplicationsApi.getByJobRequest(jobRequestId!, pageSize, 0),
    enabled: status === 'authenticated' && !!jobRequestId,
  })
}
