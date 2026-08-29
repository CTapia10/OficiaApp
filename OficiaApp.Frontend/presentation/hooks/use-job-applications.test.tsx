import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { JobApplicationResponse } from '@/domain/job-applications/types'
import { jobApplicationsApi } from '@/infrastructure/http/job-applications-api.adapter'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useJobApplications } from './use-job-applications'

vi.mock('@/infrastructure/http/job-applications-api.adapter', () => ({
  jobApplicationsApi: { getByJobRequest: vi.fn() },
}))

const mockApplication: JobApplicationResponse = {
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
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useJobApplications', () => {
  beforeEach(() => {
    vi.mocked(jobApplicationsApi.getByJobRequest).mockReset()
    useAuthStore.setState({ status: 'idle', user: null })
  })

  afterEach(() => {
    cleanup()
    useAuthStore.setState({ status: 'idle', user: null })
  })

  it('fetches applications for a job request once authenticated', async () => {
    useAuthStore.setState({ status: 'authenticated' })
    vi.mocked(jobApplicationsApi.getByJobRequest).mockResolvedValue([mockApplication])

    const { result } = renderHook(() => useJobApplications('jr-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(jobApplicationsApi.getByJobRequest).toHaveBeenCalledWith('jr-1', 50, 0)
    expect(result.current.data).toEqual([mockApplication])
  })

  it('does not call the Api without a job request id', () => {
    useAuthStore.setState({ status: 'authenticated' })

    renderHook(() => useJobApplications(null), { wrapper: createWrapper() })

    expect(jobApplicationsApi.getByJobRequest).not.toHaveBeenCalled()
  })

  it('does not call the Api while there is no authenticated session', () => {
    useAuthStore.setState({ status: 'unauthenticated' })

    renderHook(() => useJobApplications('jr-1'), { wrapper: createWrapper() })

    expect(jobApplicationsApi.getByJobRequest).not.toHaveBeenCalled()
  })
})
