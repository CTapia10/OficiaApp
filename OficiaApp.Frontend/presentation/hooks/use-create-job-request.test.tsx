import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobRequestResponse } from '@/domain/job-requests/types'
import { jobRequestsApi } from '@/infrastructure/http/job-requests-api.adapter'
import { useCreateJobRequest } from './use-create-job-request'

vi.mock('@/infrastructure/http/job-requests-api.adapter', () => ({
  jobRequestsApi: { create: vi.fn() },
}))

const mockCreated: JobRequestResponse = {
  id: 'jr-new',
  clientProfileId: 'client-1',
  categoryId: 'cat-1',
  title: 'Nueva solicitud',
  description: 'Descripción',
  status: 'Pending',
  imageUrls: [],
  createdAt: '2026-08-28T00:00:00.000Z',
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

  return {
    queryClient,
    invalidateSpy,
    Wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  }
}

describe('useCreateJobRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls create and invalidates my job requests on success', async () => {
    vi.mocked(jobRequestsApi.create).mockResolvedValue(mockCreated)
    const { Wrapper, invalidateSpy } = createWrapper()

    const { result } = renderHook(() => useCreateJobRequest(), { wrapper: Wrapper })

    await result.current.mutateAsync({
      categoryId: 'cat-1',
      title: 'Nueva solicitud',
      description: 'Descripción',
      imageUrls: [],
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobRequestsApi.create).toHaveBeenCalledWith({
      categoryId: 'cat-1',
      title: 'Nueva solicitud',
      description: 'Descripción',
      imageUrls: [],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['job-requests', 'my'] })
  })
})
