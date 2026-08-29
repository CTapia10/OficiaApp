import type { CreatePostPayload, FeedCursor, FeedResult, PostResponse } from '@/domain/posts/types'

export interface PostsApiPort {
  getFeed(cursor: FeedCursor, take?: number): Promise<FeedResult>
  create(payload: CreatePostPayload): Promise<PostResponse>
}
