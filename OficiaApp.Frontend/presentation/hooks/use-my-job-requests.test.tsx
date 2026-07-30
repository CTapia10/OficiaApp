import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobRequestResponse } from '@/domain/job-requests/types'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useMyJobRequests } from './use-my-job-requests'

// Replaces the real adapter (which would call `fetch`) with a fake we control per test.
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

// useQuery needs a QueryClient available via React Context — this wrapper provides one
// scoped to each test (fresh cache per test, no leakage between them).
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

  it('fetches with the given take/skip once the session is authenticated', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    vi.mocked(jobRequestsApi.getMy).mockResolvedValue([mockJobRequest])

    const { result } = renderHook(() => useMyJobRequests(5, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobRequestsApi.getMy).toHaveBeenCalledWith(5, 10)
    expect(result.current.data).toEqual([mockJobRequest])
  })

  it('does not call the Api while there is no authenticated session', () => {
    useAuthStore.setState({ status: 'unauthenticated' })

    renderHook(() => useMyJobRequests(), { wrapper: createWrapper() })

    expect(jobRequestsApi.getMy).not.toHaveBeenCalled()
  })
})
