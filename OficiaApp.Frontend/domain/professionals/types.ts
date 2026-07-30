export type Professional = {
  userId: string
  profileId: string
  username: string
  bio: string
  yearsOfExperience: number
  hourlyRate: number
  categories: { id: string; name: string }[]
}

export type SearchProfessionalsFilters = {
  categoryId?: string
  maxHourlyRate?: number
}
