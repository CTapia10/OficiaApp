import type { JobApplicationsApiPort } from '@/application/ports/out/job-applications-api.port'
import type {
  CreateJobApplicationPayload,
  JobApplicationResponse,
} from '@/domain/job-applications/types'
import { apiFetch } from './api-client'

export const jobApplicationsApi: JobApplicationsApiPort = {
  apply(payload: CreateJobApplicationPayload): Promise<JobApplicationResponse> {
    return apiFetch<JobApplicationResponse>('/api/job-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getByJobRequest(
    jobRequestId: string,
    take: number,
    skip: number,
  ): Promise<JobApplicationResponse[]> {
    const params = new URLSearchParams()
    params.set('jobRequestId', jobRequestId)
    params.set('take', String(take))
    params.set('skip', String(skip))
    return apiFetch<JobApplicationResponse[]>(`/api/job-applications?${params.toString()}`)
  },

  accept(applicationId: string): Promise<JobApplicationResponse> {
    return apiFetch<JobApplicationResponse>(`/api/job-applications/${applicationId}/accept`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },
}
