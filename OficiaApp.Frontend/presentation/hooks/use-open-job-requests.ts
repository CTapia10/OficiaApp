'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'

const DEFAULT_PAGE_SIZE = 10

export function useOpenJobRequests(pageSize = DEFAULT_PAGE_SIZE) {
  const status = useAuthStore((s) => s.status)

  return useInfiniteQuery({
    queryKey: ['job-requests', 'open', pageSize],
    queryFn: ({ pageParam }) => jobRequestsApi.getOpen(pageSize, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length * pageSize,
    // Skip [Authorize] endpoint without session: avoids expected 401 flicker.
    enabled: status === 'authenticated',
  })
}
