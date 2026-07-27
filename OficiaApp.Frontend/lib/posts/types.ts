export type PostResponse = {
  id: string
  professionalProfileId: string
  mediaUrl: string
  caption: string | null
  createdAt: string
}

export type FeedResult = {
  items: PostResponse[]
  nextCursorCreatedAt: string | null
  nextCursorId: string | null
}

// null = primera página (sin cursor previo).
export type FeedCursor = {
  cursorCreatedAt: string
  cursorId: string
} | null
