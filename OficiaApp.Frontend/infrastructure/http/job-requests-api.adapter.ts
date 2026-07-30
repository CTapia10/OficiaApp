import type { JobRequestsApiPort } from '@/application/ports/out/job-requests-api.port'
import type { CreateJobRequestPayload, JobRequestResponse } from '@/domain/job-requests/types'
import { apiFetch } from './api-client'

export const jobRequestsApi: JobRequestsApiPort = {
  // Requires session: Api endpoint is [Authorize] (B2B job board).
  getOpen(): Promise<JobRequestResponse[]> {
    return apiFetch<JobRequestResponse[]>('/api/job-requests/open')
  },

  getMy(take: number, skip: number): Promise<JobRequestResponse[]> {
    const params = new URLSearchParams()
    params.set('take', String(take))
    params.set('skip', String(skip))
    return apiFetch<JobRequestResponse[]>(`/api/job-requests/my?${params.toString()}`)
  },

  create(payload: CreateJobRequestPayload): Promise<JobRequestResponse> {
    return apiFetch<JobRequestResponse>('/api/job-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
