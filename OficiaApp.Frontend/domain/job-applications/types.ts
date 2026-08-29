export type JobApplicationStatus = 'Pending' | 'Accepted' | 'Rejected'

export type JobApplicationResponse = {
  id: string
  jobRequestId: string
  professionalProfileId: string
  professionalUsername: string
  proposedPrice: number
  status: JobApplicationStatus
  createdAt: string
}

export type CreateJobApplicationPayload = {
  jobRequestId: string
  proposedPrice: number
}
