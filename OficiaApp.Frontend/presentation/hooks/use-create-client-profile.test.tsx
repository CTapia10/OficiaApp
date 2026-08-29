import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clientProfileApi } from '@/infrastructure/http/client-profile-api.adapter'
import { useCreateClientProfile } from './use-create-client-profile'

vi.mock('@/infrastructure/http/client-profile-api.adapter', () => ({
  clientProfileApi: { createProfile: vi.fn() },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useCreateClientProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls createProfile with phone number', async () => {
    vi.mocked(clientProfileApi.createProfile).mockResolvedValue(undefined)

    const { result } = renderHook(() => useCreateClientProfile(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ phoneNumber: '+54 11 1234-5678' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(clientProfileApi.createProfile).toHaveBeenCalledWith({
      phoneNumber: '+54 11 1234-5678',
    })
  })
})
