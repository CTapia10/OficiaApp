import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobRequestResponse } from '@/domain/job-requests/types'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useOpenJobRequests } from './use-open-job-requests'

vi.mock('@/infrastructure/http/job-requests-api.adapter', () => ({
  jobRequestsApi: { getOpen: vi.fn() },
}))

function mockJobRequest(id: string): JobRequestResponse {
  return {
    id,
    clientProfileId: 'client-1',
    categoryId: 'cat-1',
    title: `Job ${id}`,
    description: 'Open request',
    status: 'Pending',
    imageUrls: [],
    createdAt: '2026-07-29T00:00:00.000Z',
  }
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useOpenJobRequests', () => {
  beforeEach(() => {
    vi.mocked(jobRequestsApi.getOpen).mockReset()
    useAuthStore.setState({ status: 'idle', user: null })
  })

  it('fetches the first page with take/skip once the session is authenticated', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    vi.mocked(jobRequestsApi.getOpen).mockResolvedValue([mockJobRequest('jr-1')])

    const { result } = renderHook(() => useOpenJobRequests(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobRequestsApi.getOpen).toHaveBeenCalledWith(10, 0)
    expect(result.current.data?.pages.flat()).toEqual([mockJobRequest('jr-1')])
    expect(result.current.hasNextPage).toBe(false)
  })

  it('does not call the Api while there is no authenticated session', () => {
    useAuthStore.setState({ status: 'unauthenticated' })

    renderHook(() => useOpenJobRequests(), { wrapper: createWrapper() })

    expect(jobRequestsApi.getOpen).not.toHaveBeenCalled()
  })

  it('requests the next skip when the last page is full', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    const fullPage = Array.from({ length: 10 }, (_, i) => mockJobRequest(`jr-${i}`))
    vi.mocked(jobRequestsApi.getOpen).mockImplementation(async (_take, skip) =>
      skip === 0 ? fullPage : [mockJobRequest('jr-10')],
    )

    const { result } = renderHook(() => useOpenJobRequests(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(true)

    await result.current.fetchNextPage()

    await waitFor(() => expect(jobRequestsApi.getOpen).toHaveBeenCalledWith(10, 10))
    await waitFor(() => expect(result.current.data?.pages.flat().map((j) => j.id)).toContain('jr-10'))
  })
})
