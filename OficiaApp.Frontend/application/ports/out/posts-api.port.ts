import type { FeedCursor, FeedResult } from '@/domain/posts/types'

export interface PostsApiPort {
  getFeed(cursor: FeedCursor, take?: number): Promise<FeedResult>
}
