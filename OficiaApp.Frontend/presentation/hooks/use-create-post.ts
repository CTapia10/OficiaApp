'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreatePostPayload } from '@/domain/posts/types'
import { postsApi } from '@/infrastructure/http/posts-api.adapter'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] })
    },
  })
}
