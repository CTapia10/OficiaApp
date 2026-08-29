import type { PostsApiPort } from '@/application/ports/out/posts-api.port'
import type { CreatePostPayload, FeedCursor, FeedResult, PostResponse } from '@/domain/posts/types'
import { apiFetch } from './api-client'

export const postsApi: PostsApiPort = {
  // Public ([AllowAnonymous] on Api); apiFetch still sends credentials: 'include'.
  getFeed(cursor: FeedCursor, take = 10): Promise<FeedResult> {
    const params = new URLSearchParams()
    if (cursor) {
      params.set('cursorCreatedAt', cursor.cursorCreatedAt)
      params.set('cursorId', cursor.cursorId)
    }
    params.set('take', String(take))
    return apiFetch<FeedResult>(`/api/posts/feed?${params.toString()}`)
  },

  create(payload: CreatePostPayload): Promise<PostResponse> {
    return apiFetch<PostResponse>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
