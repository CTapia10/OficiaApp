import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobApplicationResponse } from '@/domain/job-applications/types'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'
import { useCreateJobApplication } from './use-create-job-application'

vi.mock('@/infrastructure/http/job-applications-api.adapter', () => ({
  jobApplicationsApi: { apply: vi.fn() },
}))

const mockCreated: JobApplicationResponse = {
  id: 'app-1',
  jobRequestId: 'jr-1',
  professionalProfileId: 'pro-1',
  professionalUsername: 'pro_user',
  proposedPrice: 8500,
  status: 'Pending',
  createdAt: '2026-08-28T00:00:00.000Z',
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

describe('useCreateJobApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls apply and invalidates open job requests on success', async () => {
    vi.mocked(jobApplicationsApi.apply).mockResolvedValue(mockCreated)
    const { Wrapper, invalidateSpy } = createWrapper()

    const { result } = renderHook(() => useCreateJobApplication(), { wrapper: Wrapper })

    await result.current.mutateAsync({
      jobRequestId: 'jr-1',
      proposedPrice: 8500,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobApplicationsApi.apply).toHaveBeenCalledWith({
      jobRequestId: 'jr-1',
      proposedPrice: 8500,
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['job-requests', 'open'] })
  })
})
