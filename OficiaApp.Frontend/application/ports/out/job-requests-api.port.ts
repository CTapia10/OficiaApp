import type { JobRequestResponse } from '@/domain/job-requests/types'

export interface JobRequestsApiPort {
  getOpen(): Promise<JobRequestResponse[]>
}
