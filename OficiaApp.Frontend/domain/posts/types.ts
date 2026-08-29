export type CreatePostPayload = {
  mediaUrl: string
  caption?: string | null
}

export type PostResponse = {
  id: string
  professionalProfileId: string
  mediaUrl: string
  caption: string | null
  createdAt: string
  authorUsername: string
  authorPrimaryCategory: string | null
}

export type FeedResult = {
  items: PostResponse[]
  nextCursorCreatedAt: string | null
  nextCursorId: string | null
}

// null = first page (no previous cursor).
export type FeedCursor = {
  cursorCreatedAt: string
  cursorId: string
} | null
