import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobApplicationResponse } from '@/domain/job-applications/types'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'
import { useAcceptJobApplication } from './use-accept-job-application'

vi.mock('@/infrastructure/http/job-applications-api.adapter', () => ({
  jobApplicationsApi: { accept: vi.fn() },
}))

const mockAccepted: JobApplicationResponse = {
  id: 'app-1',
  jobRequestId: 'jr-1',
  professionalProfileId: 'pro-1',
  professionalUsername: 'pro_user',
  proposedPrice: 8500,
  status: 'Accepted',
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

describe('useAcceptJobApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls accept and invalidates my job requests and applications on success', async () => {
    vi.mocked(jobApplicationsApi.accept).mockResolvedValue(mockAccepted)
    const { Wrapper, invalidateSpy } = createWrapper()

    const { result } = renderHook(() => useAcceptJobApplication(), { wrapper: Wrapper })

    await result.current.mutateAsync('app-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobApplicationsApi.accept).toHaveBeenCalledWith('app-1')
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['job-requests', 'my'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['job-applications'] })
  })
})
