import type { JobRequestResponse, CreateJobRequestPayload } from '@/domain/job-requests/types'

export interface JobRequestsApiPort {
  getOpen(): Promise<JobRequestResponse[]>
  getMy(take: number, skip: number): Promise<JobRequestResponse[]>
  create(payload: CreateJobRequestPayload): Promise<JobRequestResponse>
}
