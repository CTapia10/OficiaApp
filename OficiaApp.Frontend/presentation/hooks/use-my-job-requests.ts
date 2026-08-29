'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'

const DEFAULT_PAGE_SIZE = 10

export function useMyJobRequests(pageSize = DEFAULT_PAGE_SIZE) {
  const status = useAuthStore((s) => s.status)

  return useInfiniteQuery({
    queryKey: ['job-requests', 'my', pageSize],
    queryFn: ({ pageParam }) => jobRequestsApi.getMy(pageSize, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length * pageSize,
    enabled: status === 'authenticated',
  })
}
