'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { postsService } from '@/lib/posts/posts-service'
import type { FeedCursor } from '@/lib/posts/types'

const DEFAULT_PAGE_SIZE = 10

export function useFeed(pageSize = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam }) => postsService.getFeed(pageParam, pageSize),
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
