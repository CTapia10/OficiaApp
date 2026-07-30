'use client'

import { useQuery } from '@tanstack/react-query'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'

export function useOpenJobRequests() {
  const status = useAuthStore((s) => s.status)

  return useQuery({
    queryKey: ['job-requests', 'open'],
    queryFn: () => jobRequestsApi.getOpen(),
    // Skip [Authorize] endpoint without session: avoids expected 401 flicker.
    enabled: status === 'authenticated',
  })
}
