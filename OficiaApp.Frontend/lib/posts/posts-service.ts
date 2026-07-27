import { apiFetch } from '@/lib/api/api-client'
import type { FeedCursor, FeedResult } from './types'

export const postsService = {
  // Pública ([AllowAnonymous] en la Api): apiFetch igual manda credentials
  // 'include' siempre, no hace falta lógica extra de sesión acá.
  getFeed(cursor: FeedCursor, take = 10): Promise<FeedResult> {
    const params = new URLSearchParams()
    if (cursor) {
      params.set('cursorCreatedAt', cursor.cursorCreatedAt)
      params.set('cursorId', cursor.cursorId)
    }
    params.set('take', String(take))
    return apiFetch<FeedResult>(`/api/posts/feed?${params.toString()}`)
  },
}
