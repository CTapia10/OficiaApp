import type {
  CreateJobApplicationPayload,
  JobApplicationResponse,
} from '@/domain/job-applications/types'

export interface JobApplicationsApiPort {
  apply(payload: CreateJobApplicationPayload): Promise<JobApplicationResponse>
  getByJobRequest(jobRequestId: string, take: number, skip: number): Promise<JobApplicationResponse[]>
  accept(applicationId: string): Promise<JobApplicationResponse>
}
