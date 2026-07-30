import type { JobRequestsApiPort } from '@/application/ports/out/job-requests-api.port'
import type { JobRequestResponse } from '@/domain/job-requests/types'
import { apiFetch } from './api-client'

export const jobRequestsApi: JobRequestsApiPort = {
  // Requires session: Api endpoint is [Authorize] (B2B job board).
  getOpen(): Promise<JobRequestResponse[]> {
    return apiFetch<JobRequestResponse[]>('/api/job-requests/open')
  },
}
