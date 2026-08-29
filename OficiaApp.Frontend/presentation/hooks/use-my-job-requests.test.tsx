import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobRequestResponse } from '@/domain/job-requests/types'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useMyJobRequests } from './use-my-job-requests'

vi.mock('@/infrastructure/http/job-requests-api.adapter', () => ({
  jobRequestsApi: { getMy: vi.fn() },
}))

const mockJobRequest: JobRequestResponse = {
  id: 'jr-1',
  clientProfileId: 'client-1',
  categoryId: 'cat-1',
  title: 'Arreglar canilla que pierde',
  description: 'Pierde agua en la cocina',
  status: 'Pending',
  imageUrls: [],
  createdAt: '2026-07-29T00:00:00.000Z',
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useMyJobRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ status: 'idle', user: null })
  })

  it('fetches first page with skip 0 once authenticated', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    vi.mocked(jobRequestsApi.getMy).mockResolvedValue([mockJobRequest])

    const { result } = renderHook(() => useMyJobRequests(5), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobRequestsApi.getMy).toHaveBeenCalledWith(5, 0)
    expect(result.current.data?.pages[0]).toEqual([mockJobRequest])
  })

  it('requests the next skip when the last page is full', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    const fullPage = Array.from({ length: 10 }, (_, i) => ({ ...mockJobRequest, id: `jr-${i}` }))
    vi.mocked(jobRequestsApi.getMy).mockImplementation(async (_take, skip) =>
      skip === 0 ? fullPage : [{ ...mockJobRequest, id: 'jr-10' }],
    )

    const { result } = renderHook(() => useMyJobRequests(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(true)

    await result.current.fetchNextPage()

    await waitFor(() => expect(jobRequestsApi.getMy).toHaveBeenCalledWith(10, 10))
    await waitFor(() =>
      expect(result.current.data?.pages.flat().map((j) => j.id)).toContain('jr-10'),
    )
  })

  it('does not call the Api while there is no authenticated session', () => {
    useAuthStore.setState({ status: 'unauthenticated' })

    renderHook(() => useMyJobRequests(), { wrapper: createWrapper() })

    expect(jobRequestsApi.getMy).not.toHaveBeenCalled()
  })
})
