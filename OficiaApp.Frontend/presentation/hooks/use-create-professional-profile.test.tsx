import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { professionalProfileApi } from '@/infrastructure/http/professional-profile-api.adapter'
import { useCreateProfessionalProfile } from './use-create-professional-profile'

vi.mock('@/infrastructure/http/professional-profile-api.adapter', () => ({
  professionalProfileApi: {
    createProfile: vi.fn(),
    addCategory: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useCreateProfessionalProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates profile then adds category', async () => {
    vi.mocked(professionalProfileApi.createProfile).mockResolvedValue(undefined)
    vi.mocked(professionalProfileApi.addCategory).mockResolvedValue(undefined)

    const { result } = renderHook(() => useCreateProfessionalProfile(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      bio: 'Electricista matriculado',
      yearsOfExperience: 5,
      hourlyRate: 12000,
      categoryId: 'cat-1',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(professionalProfileApi.createProfile).toHaveBeenCalledWith({
      bio: 'Electricista matriculado',
      yearsOfExperience: 5,
      hourlyRate: 12000,
    })
    expect(professionalProfileApi.addCategory).toHaveBeenCalledWith('cat-1')
  })
})
