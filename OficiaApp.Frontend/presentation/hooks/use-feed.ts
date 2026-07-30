'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { postsApi } from '@/infrastructure/http/posts-api.adapter'
import type { FeedCursor } from '@/domain/posts/types'

const DEFAULT_PAGE_SIZE = 10

export function useFeed(pageSize = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam }) => postsApi.getFeed(pageParam, pageSize),
    initialPageParam: null as FeedCursor,
    getNextPageParam: (lastPage): FeedCursor | undefined =>
      lastPage.nextCursorCreatedAt && lastPage.nextCursorId
        ? {
            cursorCreatedAt: lastPage.nextCursorCreatedAt,
            cursorId: lastPage.nextCursorId,
          }
        : undefined,
  })
}
