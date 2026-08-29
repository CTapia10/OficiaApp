import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PostResponse } from '@/domain/posts/types'
import { postsApi } from '@/infrastructure/http/posts-api.adapter'
import { useCreatePost } from './use-create-post'

vi.mock('@/infrastructure/http/posts-api.adapter', () => ({
  postsApi: { create: vi.fn() },
}))

const mockPost: PostResponse = {
  id: 'post-1',
  professionalProfileId: 'pro-1',
  mediaUrl: 'https://cdn.example.com/work.jpg',
  caption: 'Trabajo terminado',
  createdAt: '2026-08-28T00:00:00.000Z',
  authorUsername: 'juanpro',
  authorPrimaryCategory: 'Electricidad',
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

  return {
    invalidateSpy,
    Wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  }
}

describe('useCreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls create and invalidates feed on success', async () => {
    vi.mocked(postsApi.create).mockResolvedValue(mockPost)
    const { Wrapper, invalidateSpy } = createWrapper()

    const { result } = renderHook(() => useCreatePost(), { wrapper: Wrapper })

    await result.current.mutateAsync({
      mediaUrl: 'https://cdn.example.com/work.jpg',
      caption: 'Trabajo terminado',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(postsApi.create).toHaveBeenCalledWith({
      mediaUrl: 'https://cdn.example.com/work.jpg',
      caption: 'Trabajo terminado',
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['posts', 'feed'] })
  })
})
