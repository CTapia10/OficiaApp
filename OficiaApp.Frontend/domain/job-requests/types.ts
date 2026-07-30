export type JobRequestStatus = 'Open' | 'InProgress' | 'Closed' | string

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
