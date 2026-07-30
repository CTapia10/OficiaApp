export type JobRequestStatus = 'Pending' | 'Accepted' | 'InProgress' | 'Rejected' | 'Completed' | 'Cancelled'

export type JobRequestResponse = {
  id: string
  clientProfileId: string
  categoryId: string
  title: string
  description: string
  status: JobRequestStatus
  imageUrls: string[]
  createdAt: string
}

export type CreateJobRequestPayload = {
  categoryId: string
  title: string
  description: string
  imageUrls: string[]
}