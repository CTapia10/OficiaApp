'use client'

import { useQuery } from '@tanstack/react-query'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'

export function useMyJobRequests(take = 10, skip = 0) {
  const status = useAuthStore((s) => s.status)

  return useQuery({
    queryKey: ['job-requests', 'my', take, skip],
    queryFn: () => jobRequestsApi.getMy(take, skip),
    // Skip [Authorize] endpoint without session: avoids expected 401 flicker.
    enabled: status === 'authenticated',
  })
}
